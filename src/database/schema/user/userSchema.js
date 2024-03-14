import { Schema, model } from "mongoose";

const userModel = model(
  "users",
  new Schema({
    username: {
      type: String,
      required: [true, "name is needed"]
    },
    email: {
      type: String,
      unique: true,
      required: [true, "email is needed"]
    },
    password:{
      type: String,
      required: [true, "password is needed"]
    },
  },{
    timestamps: true
  })
);

export default userModel;
