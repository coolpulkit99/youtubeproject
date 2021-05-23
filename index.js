const express = require('express')
const app = express()
const got = require('got');
const database_operations = require('./database_operations.js');
require('dotenv').config();


const port = 3000
var timer = undefined;

// Status endpoint
app.get('/', (req, res) => {
    res.send('Up!')
})

//function to write video items to mongo
//items can be collected in array and sent using create many in mongo too to save server processing
function processWriteToMongo(item) {

    let jsonObject = {
        _id: item.id.videoId,
        publishedAt: item.snippet.publishedAt,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.default.url,
    }

    database_operations.createVideo(jsonObject, null);

}

// functtion gets 5 latest videos for a keyword 
function updateYoutubeData() {

    got('https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&order=date&type=video&key=' + process.env.KEY + '&q=football')
        .then(response => {
            let jsonResponseBody = JSON.parse(response.body);
            let items = jsonResponseBody["items"];
            items.forEach(element => {
                processWriteToMongo(element);
            });

        }).catch(error => {
            console.log(error);
        });

}




// Control endpoint to start the timer to keep refreshing/updating youtube data
app.get('/startTimer', (req, res) => {
    if (timer) {
        res.send("Timer already set, use /endTimer to clear it");
    } else {
        res.send("Timer set");
        timer = setInterval(
            () => {
                setTimeout(updateYoutubeData, 1)
            }, 10000)
    }
})

// Control endpoint to stop the timer
app.get('/endTimer', (req, res) => {

    if (timer) {
        res.send("Timer cleared");
        clearInterval(timer);
        timer = undefined;
    }
    else {
        res.send("No timer was set");
    }

})

// Fetch paginated response from api containing latest videos
// Default limit for page set to 5 for simplicity
//:page is the page number which we need to return
// takes title and desc as query values for string matching and search
app.get('/getData/:page', (req, res) => {
    const resultsPerPage = 5;
    let page = req.params.page >= 1 ? req.params.page : 1;
    page = page - 1;
    database_operations.fetchVideos(page, resultsPerPage,req.query.title,req.query.desc, null)
        .then(resp => {
            res.send({
                videos: resp
            });
        })

})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})