import express from "express";
import companyController from "../../controller/company/companyController.js";

const companyRouter = express.Router();

companyRouter.get("/list",companyController.getCompanyList);
companyRouter.get("/profile/:companyName", companyController.getCompanyProfileByName);
companyRouter.get("/summary/:companyName", companyController.getCompanySummaryByName);
companyRouter.get("/financial/balancesheet/:companyName", companyController.getCompanyBalanceSheetByName)
companyRouter.get("/financial/incomestatement/:companyName", companyController.getCompanyIncomeStatementByName)
companyRouter.get("/financial/cashflow/:companyName", companyController.getCompanyCashFlowByName)
companyRouter.get("/stock/name/:companyName", companyController.getCompanyStockHistoryByName)
companyRouter.get("/stock/code/:stockCode", companyController.getCompanyStockHistoryByCode)
export default companyRouter;