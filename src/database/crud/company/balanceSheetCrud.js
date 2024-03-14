import BalanceSheet from "../../schema/company/balanceSheetSchema.js";

export default{
    async getCompanyBalanceSheetByName(companyName) {

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
        const balanceSheets = await BalanceSheet.aggregate(aggregationPipeline)        
        
        return balanceSheets;
    },

}