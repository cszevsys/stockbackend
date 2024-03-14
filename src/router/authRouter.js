import authController from "../controller/authController.js";
import authJwt from "../middleware/authJwt.js";
import express from "express";

const authRouter = express.Router();

authRouter.post("/register",
    authController.register)

authRouter.post("/login", 
    authController.signin);

authRouter.post("/logout", 
    authController.signout);

authRouter.post("/refresh",
    authController.refreshToken);

authRouter.post("/changePwd", 
    authController.changePassword);

export default authRouter;
