import responseBody from "../../responseBody/commonResponseBody.js";
import companyCrud from "../../database/crud/company/companyCrud.js";
import companySummaryCrud from "../../database/crud/company/companySummaryCrud.js";
import stockHistoryCrud from "../../database/crud/company/stockHistoryCrud.js";
import balanceSheetCrud from "../../database/crud/company/balanceSheetCrud.js";
import utils from "../../utils/utils.js";
import incomeStatementCrud from "../../database/crud/company/incomeStatementCrud.js";
import cashFlowCrud from "../../database/crud/company/cashFlowCrud.js";

const companyController = {
    async getCompanyList(req, res){
        try{
            const [page, size, sortBy, sortOrder, searchField, searchQuery, filter, filterId] = utils.getQueryParameters(req.query)

            var results = { page: page, size: size }

            const fieldQueries = searchField.map(field => ({
                [field.replace(/ /g, '')]: { $regex: searchQuery, $options: 'i' }
            }));

            const search = fieldQueries.length != 0 ? { $or: fieldQueries } : {};

            filterId ? search[filter] = filterId : ''

            const aggregationPipeline = [
                { $match: search },
                { $project: { uid: 0, __v: 0 } }
            ]
            const companies = await companyCrud.getCompanyListWithAggr(aggregationPipeline, page, size, sortBy, sortOrder);
            const total = await companyCrud.getTotalCompanyWithAggr(aggregationPipeline);
            results.data = companies;
            results.total = total;

            responseBody.successHandler(res, results);
        }
        catch(error){
            responseBody.errorHandler(res, error);
        }
        
    },

    async getCompanyListSimplified(req, res){
        try{
            var companies = await companyCrud.getCompanyListSimplified();
            responseBody.successHandler(res, companies);
        }
        catch(error){
            responseBody.errorHandler(res, error);
        }
    },
    
    async getCompanyProfileByName(req, res){
        try{
            const company = await companyCrud.getCompanyByCompanyName(req.params.companyName);
            responseBody.successHandler(res, company);
        }
        catch(error){
            responseBody.errorHandler(res, error);
        }
    },
    async getCompanySummaryByName(req, res){
        try{
            const summary = await companySummaryCrud.getCompanySummaryByCompanyName(req.params.companyName);
            responseBody.successHandler(res, summary);
        }
        catch(error){
            responseBody.errorHandler(res, error);
        }
    },
    async getCompanyStockHistoryByName(req, res){
        try{
            const history = await stockHistoryCrud.getStockHistoryByName(req.params.companyName);
            responseBody.successHandler(res, history);
        }
        catch(error){
            responseBody.errorHandler(res, error);
        }
    },
    async getCompanyStockHistoryByCode(req, res){
        try{
            const history = await stockHistoryCrud.getStockHistoryByCode(req.params.stockCode);
            responseBody.successHandler(res, history);
        }
        catch(error){
            responseBody.errorHandler(res, error);
        }
    },
    async getCompanyBalanceSheetByName(req, res){
        try{
            const balancesheets = await balanceSheetCrud.getCompanyBalanceSheetByName(req.params.companyName);
            responseBody.successHandler(res, balancesheets);
        }
        catch(error){
            responseBody.errorHandler(res, error);
        }
    },
    async getCompanyIncomeStatementByName(req, res){
        try{
            const incomestatements = await incomeStatementCrud.getCompanyIncomeStatementByName(req.params.companyName);
            responseBody.successHandler(res, incomestatements);
        }
        catch(error){
            responseBody.errorHandler(res, error);
        }
    },
    async getCompanyCashFlowByName(req, res){
        try{
            const cashFlows = await cashFlowCrud.getCompanyCashFlowByName(req.params.companyName);
            responseBody.successHandler(res, cashFlows);
        }
        catch(error){
            responseBody.errorHandler(res, error);
        }
    },
    

    

}

export default companyController;