import CashFlow from "../../schema/company/cashFlowSchema.js";

export default{
    async getCompanyCashFlowByName(companyName) {

        const aggregationPipeline = [
            {
                $match: {companyName: companyName}
            },
            {
                $sort: { date: 1 } // Sort documents by date in ascending order
            },
            {
                $group: {
                    _id: "$date", // Group by date
                    documents: { $push: "$$ROOT" } // Push all documents into an array
                }
            }
        ];
        const cashflows = await CashFlow.aggregate(aggregationPipeline)        
        
        return cashflows;
    },

}