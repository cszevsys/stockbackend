import { Schema, model } from "mongoose";

const stockHistoryModel = model(
    "stockHistories",
    new Schema({
        date: {
            type: Date
        },
        open: {
            type: Number
        },
        high: {
            type: Number
        },
        low: {
            type: Number
        },
        close: {
            type: Number
        },
        adjClose: {
            type: Number
        },
        volume: {
            type: Number
        },
        companyName: {
            type: String,
            required: [true, "company name is needed"]
        },
        stockCode: {
            type: String,
            required: [true, "stock code is needed"]
        }
    },
    {
      timestamps: true
    })
)

export default stockHistoryModel;