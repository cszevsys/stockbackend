import NotFoundException from "../../../exception/notFoundException.js";
import CompanySummary from "../../schema/company/companySummarySchema.js"

export default {
    async getCompanySummaryByCompanyName(companyName){
        const company = await CompanySummary.findOne({companyName: companyName});
        if(!company){
            throw new NotFoundException("company summary not found");
        }
        return company;
    },
}