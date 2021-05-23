var mongoose = require('mongoose');
require('dotenv').config();


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const Schema = mongoose.Schema;
const videoSchema = new Schema({
    _id: String,
    publishedAt: Date,
    title: String,
    description: String,
    thumbnail: String,
});

var videoData = mongoose.model("VideoData", videoSchema);


module.exports = {
    createVideo: function (dataObj, callback) {
        console.log("saving data");
        let video = new videoData(dataObj);
        videoData.findOneAndUpdate(dataObj, dataObj, { upsert: true }, function (err, data) {
            if (err)
                return console.error(err);
            console.log("saved Data");
        });
    },

    fetchVideos: async function (page, resultsPerPage, title, desc, callback) {
        console.log("retreiving data");

        if (!title)
            title = ""
        if (!desc)
            desc = ""

        let result = {};
        result = await videoData.find({
            title: { $regex: title, $options: "i" },
            description: { $regex: desc, $options: "i" }
        })
            .sort({ publishedAt: "desc" })
            .limit(resultsPerPage)
            .skip(resultsPerPage * page);
        return result;
    },

};