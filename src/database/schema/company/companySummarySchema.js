import { Schema, model } from "mongoose";

const companySummaryModel = model(
    "companySummaries",
    new Schema({
        previousClose: {
            type: Number
        },
        open: {
            type: Number
        },
        dayRange: {
            type: String
        },
        fiftyTwoWeekRange: {
            type: String
        },
        volume: {
            type: Number
        },
        avgVolume: {
            type: Number
        },
        fiftyDayMA: {
            type: Number
        },
        twoHundredDayMA: {
            type: Number
        },
        marketCap: {
            type: Number
        },
        eps: {
            type: Number
        },
        forwardDividendYield: {
            type: Number
        },
        companyName: {
            type: String,
            required: [true, "company name is needed"]
        }
    },
    {
      timestamps: true
    })
)

export default companySummaryModel;