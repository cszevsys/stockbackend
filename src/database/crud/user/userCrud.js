import NotFoundException from '../../../exception/notFoundException.js';
import User from "../../schema/user/userSchema.js";

export default{
    async createUser(body) {
        const user = await User.create(body);
        return user;
    },

    async getUserByEmail(email) {
        const foundUser = await User.findOne({ email: email })
        if (!foundUser) {
            throw new NotFoundException("User not exists");
        }
        const userDetail = ({
            username    : foundUser.username,
            email       : foundUser.email,
            userId      : foundUser._id,
          })

        return userDetail;
    },
    
    async checkEmailExist(email){
        const user = await User.findOne({ email: email })
        return user
    },

    async checkUsernameExist(username){
        const user = await User.findOne({ username: username })
        return user
    },

    async getUserById(id) {
        const foundUser = await User.findOne({ _id: id  });
        if (!foundUser) {
            throw new NotFoundException("User not exists");
        }
        return foundUser;
    },

    async updateUserInfo(userId, body){

        const user = await User.findOneAndUpdate({ _id: userId }, body, { new: true, runValidators: true});
        if (!user) {
            throw new NotFoundException("User not exists");
        }
        return user;
    },

}
