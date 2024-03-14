import BookMark from "../../schema/user/bookMarkSchema.js";


export default {
    async createBookMark(body){
        const bookmark = await BookMark.create(body);
        return bookmark;
    },

    async getUserBookMarksWithAggr(search, page = 1, size = 10, sortBy, sortOrder){
        const aggregationPipeline = [...search];
    
        aggregationPipeline.push({ $sort: {[sortBy]: sortOrder}})
        aggregationPipeline.push({ $skip: (page - 1) * size })
        aggregationPipeline.push({ $limit: size })
    
        const bookmarks = await BookMark.aggregate(aggregationPipeline)        
        
        return bookmarks;
    },

    async getTotalBookMarkWithAggr(search){
        const count = [...search];
        count.push({ $group: { _id: null, count: { $sum: 1 } } })
        count.push({ $project: { _id: 0 } })
    
        const totalCount = await BookMark.aggregate(count)
    
        return totalCount[0] ? totalCount[0].count : 0;
    },

}