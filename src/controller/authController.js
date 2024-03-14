import authCrud from "../database/crud/authCrud.js";
import userCrud from "../database/crud/user/userCrud.js";
import responseBody from "../responseBody/commonResponseBody.js";
import InvalidPwdException from "../exception/invalidPwdException.js";
import NotFoundException from "../exception/notFoundException.js";
import UnauthorizedException from "../exception/unauthorizedException.js";
import ForbiddenException from "../exception/forbiddenException.js";
import authJwt from "../middleware/authJwt.js";
import bcrypt from "bcryptjs";
import InvalidInputException from "../exception/invalidInputException.js";


const authController = {
    async register(req, res) {
        try {
            const userExist = await userCrud.checkEmailExist(req.body.email)
            if(userExist){
                throw new InvalidInputException("Email is in use!");
            }
            const saltRounds = 10;
            req.body.password = await bcrypt.hash(req.body.password, saltRounds);
            const user = await userCrud.createUser(req.body);
            responseBody.successHandler(res, user);
        }
        catch (error) {
            responseBody.errorHandler(res, error);
        }
    },
    async signin(req, res) {
        try {
            const user = await userCrud.checkEmailExist(req.body.email)
            if(!user){
                throw new NotFoundException("User not found.")
            }
            const result = await bcrypt.compare(req.body.password, user.password); 
            var userInfo
            if(result){
                userInfo = await userCrud.getUserByEmail(req.body.email)
                const accessToken   = await authJwt.generateAccessToken(req.body.email)  
                const refreshToken  = await authJwt.generateRefreshToken(user._id, req.body.email)
                userInfo.accessToken = accessToken;
                userInfo.refreshToken = refreshToken;
            }
            else{
                throw new InvalidPwdException("Incorrect Password")
            }
            responseBody.successHandler(res, userInfo);
        }
        catch (error) {
            responseBody.errorHandler(res, error);
        }
    },

    async signout(req, res){
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader && authHeader.split(' ')[1];
            if(!token) {
                throw new ForbiddenException("Refresh Token not found")
            }
            
            const revokeToken = await authCrud.deactivateRefreshToken(token)

            responseBody.successHandler(res, "Logout Successfully");
        }
        catch (error) {
            responseBody.errorHandler(res, error);
        }
    },

    async refreshToken(req, res){
        try {
            const authHeader  = req.headers.authorization;
            const token       = authHeader && authHeader.split(' ')[1];

            if(!token) throw new ForbiddenException("Refresh Token not found")

            const tokenDetails  = await authJwt.verifyRefreshToken(token)
            const userInfo      = await userCrud.getUserByEmail(tokenDetails.email)

            const currentRefreshToken = await authCrud.getRefreshToken(token)
            if(currentRefreshToken == null){
                throw new ForbiddenException("Please login again")
            }

            const accessToken   = await authJwt.generateAccessToken(userInfo.email)  

            responseBody.successHandler(res, {accessToken});
        }
        catch (error) {
            responseBody.errorHandler(res, error);
        }
    },

    async changePassword(req, res){
        try {
            const user = await userCrud.checkEmailExist(req.body.email)
            if (!user) {
                throw new NotFoundException("User not exists");
            }
            if(req.body.newPassword != req.body.confirmPassword){ 
                throw new UnauthorizedException("New Password and Confirm Password are not match! ")
            }
            const saltRounds = 10;
            const newPassword = await bcrypt.hash(req.body.newPassword, saltRounds);
            const userRes = await userCrud.updateUserInfo(user._id, {password: newPassword})

            if(userRes) {
                responseBody.successHandler(res, "Change Password Successfully");
            }

        }
        catch (error) {
            responseBody.errorHandler(res, error);
        }
    },
}

export default authController;