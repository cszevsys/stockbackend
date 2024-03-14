import userController from "../../controller/user/userController.js";
import express from "express";
import authJwt from "../../middleware/authJwt.js";

const userRouter = express.Router();

userRouter.post("/bookmark/add", [authJwt.verifyToken()], userController.createBookMark);
userRouter.get("/bookmark/list", [authJwt.verifyToken()], userController.getUserBookMark);

export default userRouter;