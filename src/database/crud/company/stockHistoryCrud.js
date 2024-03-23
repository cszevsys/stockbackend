import StockHistory from "../../schema/company/stockHistorySchema.js";

export default{
    async getStockHistoryByName(companyName){
        const history = await StockHistory.find({companyName: companyName}).sort({date: -1});
        return history;
    },

    async getStockHistoryByCode(stockCode){
        const history = await StockHistory.find({stockCode: stockCode}).sort({date: -1});
        return history;
    }

}