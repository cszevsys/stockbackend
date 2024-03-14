import { Schema, model } from "mongoose";

const companyModel = model(
    "companies",
    new Schema({
        longBusinessSummary: {
            type: String
        },
        longName: {
            type: String
        },
        address1: {
            type: String
        },
        address2: {
            type: String
        },
        address2: {
            type: String
        },
        city: {
            type: String
        },
        zip: {
            type: String
        },
        country: {
            type: String
        },
        phone: {
            type: String
        },
        website: {
            type: String
        },
        industry: {
            type: String
        },
        sector: {
            type: String
        },
        companyName: {
            type: String,
            required: [true, "company name is needed"]
        },
        rating: {
            type: String
        }
    },
    {
      timestamps: true
    })
)

export default companyModel;