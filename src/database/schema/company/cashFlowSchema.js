import { Schema, model } from "mongoose";

const cashFlowModel = model(
    "cashFlows",
    new Schema({
        title: {
            type: String,
            required: [true, "title is needed"]
        },
        date: 
        {   type: Date,
            required: [true, "date is needed"]
        },
        value: {
            type: Number,
            required: [true, "value is needed"]
        },
        companyName: {
            type: String,
            required: [true, "company is needed"]
        }
    },
    {
      timestamps: true
    })
)

export default cashFlowModel;
