import IncomeStatement from "../../schema/company/incomeStatementSchema.js";

export default{
    async getCompanyIncomeStatementByName(companyName) {

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
        const incomeStatements = await IncomeStatement.aggregate(aggregationPipeline)        
        
        return incomeStatements;
    },

}