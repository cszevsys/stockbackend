import NotFoundException from "../../../exception/notFoundException.js";
import Company from "../../schema/company/companySchema.js"

export default {
    async getCompanyByCompanyName(companyName){
        const company = await Company.findOne({companyName: companyName});
        if(!company){
            throw new NotFoundException("company not found");
        }
        return company;
    },

    async getCompanyListWithAggr(search, page = 1, size = 10, sortBy, sortOrder) {

        const aggregationPipeline = [...search];
    
        aggregationPipeline.push({ $sort: {[sortBy]: sortOrder}})
        aggregationPipeline.push({ $skip: (page - 1) * size })
        aggregationPipeline.push({ $limit: size })
    
        const companies = await Company.aggregate(aggregationPipeline)        
        
        return companies;
    },

    async getTotalCompanyWithAggr(search){
        const count = [...search];
        count.push({ $group: { _id: null, count: { $sum: 1 } } })
        count.push({ $project: { _id: 0 } })
    
        const totalCount = await Company.aggregate(count)
    
        return totalCount[0] ? totalCount[0].count : 0;
    },

    async getCompanyListSimplified(){
        const companies = await Company.find({}, {companyName: 1, _id: 1});
        return companies;
    }
}