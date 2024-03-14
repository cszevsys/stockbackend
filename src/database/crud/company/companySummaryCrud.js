import CompanySummary from "../../schema/company/companySummarySchema.js"

export default {
    async getCompanySummaryByCompanyName(companyName){
        const company = await CompanySummary.findOne({companyName: companyName});
        return company;
    },
}