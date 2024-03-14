import { Schema, model } from "mongoose";

const userTokenModel = model(
  "userToken",
  new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: [true, "user id is needed"]
    },
    refreshToken: {
      type: String,
      required: [true, "refreshToken is needed"]
    },
    isActive: {
      type: Boolean,
      required: [true, "is active status is needed"]
    },
    createdBy: {
      type: String
    },
    updatedBy: {
      type: String
    }
  },
  {
    timestamps: true
  })
);

export default userTokenModel;
