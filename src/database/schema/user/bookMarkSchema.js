import { Schema, model } from "mongoose";

const bookMarkModel = model(
    "bookMarks",
    new Schema({
        user: {
            type: Schema.Types.ObjectId,
            required: [true, "userId is needed"],
            ref: "users"
        },
        company: {
            type: Schema.Types.ObjectId,
            required: [true, "companyId is needed"],
            ref: "companies"
        }
    },
    {
      timestamps: true
    })
)

export default bookMarkModel;
