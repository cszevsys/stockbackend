import jwt from "jsonwebtoken";
import responseBody from "../responseBody/commonResponseBody.js";
import UnauthorizedException from "../exception/unauthorizedException.js";
import ForbiddenException from "../exception/forbiddenException.js";
import authCrud from "../database/crud/authCrud.js";
import { logger } from "../../logger.js";
import { getNamespace } from 'cls-hooked';
import UserCrud from "../database/crud/user/userCrud.js";

function validateReqBody(JoiObject) {
    return async (req, res, next) => {
        try {
            var body = { ...req.body };
            delete body.updatedBy;
            delete body.createdBy;
            delete body.clientReq;
  
            var result = JoiObject.validate(body);
  
            if (result.error) {
                throw new InvalidInputException(result.error);
            }
            next();
        }
        catch (error) {
            return responseBody.errorHandler(res, error);
        }
    }
};

async function generateAccessToken (email) {
    return jwt.sign({email}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15m"})
  };
  
async function generateResetToken (email) {
    return jwt.sign({email}, process.env.RESET_TOKEN_SECRET, {expiresIn: "30m"})
};
  
async function generateRefreshToken(userId, email) {
    const refreshToken = jwt.sign({email}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "30d"})

    const token = await authCrud.createRefreshToken({userId: userId, refreshToken: refreshToken, isActive: true})

    return refreshToken
};

function verifyToken() {
    return async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader && authHeader.split(' ')[1];
            if (!token) {
                throw new UnauthorizedException("No token provided!");
            }
            try {
                verifyAccessToken(req, res, next)
            }
            catch (error) {
                logger.error(`Error: ${JSON.stringify(error.message)}`)
                throw new UnauthorizedException(error.message);
            }
        }
        catch (error) {
            logger.error(`Error: ${JSON.stringify(error.message)}`)
            return responseBody.errorHandler(res, error);
        }
    }
  };
  
  async function verifyAccessToken(req, res, next){
    try{
       try{
        const authHeader  = req.headers.authorization;
        const token       = authHeader && authHeader.split(' ')[1];
        var myRequest     = getNamespace('appName');
  
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.email     = decoded.email;
  
        const user    = await UserCrud.checkEmailExist(req.email);
        req.userId    = user._id;
        req.username  = user.username
       
        myRequest.run(function () {
          myRequest.set('email', decoded.email);
          next();
        });
      }
      catch(error){
        throw new UnauthorizedException(error.message);
      }
    }
    catch(error){
      logger.error(`Error: ${JSON.stringify(error.message)}`)
      return responseBody.errorHandler(res, error);
    }
};

// async function verifyResetToken(req, res, next) {

//     try{
//       const authHeader  = req.headers.authorization;
//       const token       = authHeader && authHeader.split(' ')[1];
//       if (!token) {
//         throw new UnauthorizedException("No token provided!");
//       }
  
//       try{
//           const decoded = jwt.verify(token, process.env.RESET_TOKEN_SECRET);
//           req.email     = decoded.email;
  
//           const user    = await UserCrud.getUserByEmail(req.email);
//           req.userId    = user.userId;
//           next()
//       }
//       catch(error){
//         throw new UnauthorizedException(error.message);
//       }
//     }
//     catch(error){
//       logger.error(`Error: ${JSON.stringify(error.message)}`)
//       return responseBody.errorHandler(res, error);
//     }
// };
  
async function verifyRefreshToken(token) {
  
      if (!token) {
        throw new UnauthorizedException("No token provided!");
      }
  
      return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async(err, decoded) => {
          if (err) { 
              const revokeToken = await authCrud.deactivateRefreshToken(token)
              throw new ForbiddenException(err.message)
          }
          else {
              return decoded
          }
      })
};


const authJwt = {
    validateReqBody,
    generateAccessToken,
    generateResetToken,
    generateRefreshToken,
    verifyToken,
    verifyRefreshToken
};
export default authJwt;
