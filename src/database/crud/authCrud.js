import NotFoundException from "../../exception/notFoundException.js";
import userTokenSchema from "../schema/user/userTokenSchema.js";

export default{
    async createRefreshToken(body){
        const user = await userTokenSchema.create(body)
        return user
    },

    async getRefreshToken(refreshToken){
        const user = await userTokenSchema.findOne({refreshToken: refreshToken, isActive: true})
        if(!user){
            throw new NotFoundException("user not found")
        }
        return user
    },

    async getRefreshTokenByUserId(userId){
        const user = await userTokenSchema.findOne({userId: userId, isActive: true})
        if(!user){
            throw new NotFoundException("user not found")
        }
        return user
    },

    async deactivateRefreshToken(token){
        const user = await userTokenSchema.findOneAndUpdate({refreshToken: token, isActive: true}, {isActive : false}, { new: true, runValidators: true});
        if(!user){
            throw new NotFoundException("user not found")
        }
        return user;
    },
}