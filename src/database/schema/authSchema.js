import { Schema, model } from "mongoose";

const authModel = model(
  "auth",
  new Schema({
    clientName: {
        type: String,
        required: [true, "clientName is needed"],
        unique: true
    },
    description: {
        type: String,
    },
    key: {
        type: String,
        required: [true, "key is needed"],
        unique: true
    },
    isActive: {
        type: Boolean,
        required: [true, "is active status is needed"],
        default: true
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
    createdBy: {
        type: String,
    },
    updatedBy: {
        type: String
    } 
  },{
    timestamps: true
  })
);

export default authModel;
