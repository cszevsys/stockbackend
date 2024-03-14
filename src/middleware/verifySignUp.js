import responseBody from "../responseBody/commonResponseBody.js";
import userCrud from "../database/crud/user/userCrud.js";
import ExistedException from "../exception/existedException.js";

async function checkDuplicateUsernameOrEmail (req, res, next) {
    try{
       const email = await userCrud.checkEmailExist(req.body.email)
       if(email) {
        throw new ExistedException("Email already existed")
       }

       const user = await userCrud.checkUsernameExist(req.body.username)
       if(user) {
        throw new ExistedException("Username already existed")
       }
       next()
    }
    catch(error){
      return responseBody.errorHandler(res, error);
    }
  };

const verifySignUp = {
    checkDuplicateUsernameOrEmail,
};
export default verifySignUp;