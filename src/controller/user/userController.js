import bookMarkCrud from "../../database/crud/user/bookMarkCrud.js";
import responseBody from "../../responseBody/commonResponseBody.js";
import utils from "../../utils/utils.js";

const userController = {
    async createBookMark(req, res){
        try{
            const bookmarkBody = {
                user: req.userId,
                company: req.body.companyId
            }
            const bookmark = await bookMarkCrud.createBookMark(bookmarkBody);
            responseBody.successHandler(res, bookmark)
        }
        catch (error){
            responseBody.errorHandler(res, error);
        }
    },

    async getUserBookMark(req, res){
        try{
            const [page, size, sortBy, sortOrder, searchField, searchQuery, filter, filterId] = utils.getQueryParameters(req.query)

            var results = { page: page, size: size }

            const fieldQueries = searchField.map(field => ({
                [field.replace(/ /g, '')]: { $regex: searchQuery, $options: 'i' }
            }));

            const search = fieldQueries.length != 0 ? { $or: fieldQueries } : {};

            filterId ? search[filter] = filterId : ''

            var aggregationPipeline = [
                { $match : { user: req.userId}},
                { $match: search}
            ];
            const bookmarks = await bookMarkCrud.getUserBookMarksWithAggr(aggregationPipeline, page, size, sortBy, sortOrder);
            const total = await bookMarkCrud.getTotalBookMarkWithAggr(aggregationPipeline);
            results.data = bookmarks;
            results.total = total;
            responseBody.successHandler(res, results);
        }
        catch (error){
            responseBody.errorHandler(res, error);
        }
        
    }
}

export default userController;