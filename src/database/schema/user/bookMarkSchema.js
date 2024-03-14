import { Schema, model } from "mongoose";

const bookMarkModel = model(
    "bookMarks",
    new Schema({
        user: {
            type: Schema.Types.ObjectId,
            ref: "users"
        },
        company: {
            type: Schema.Types.ObjectId,
            ref: "companies"
        }
    },
    {
      timestamps: true
    })
)

export default bookMarkModel;
