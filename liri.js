// 9. Make it so liri.js can take in one of the following commands:

//    * `concert-this`

//    * `spotify-this-song`

//    * `movie-this`

//    * `do-what-it-says`

// * Artist(s)

// * The song's name

// * A preview link of the song from Spotify

// * The album that the song is from

require("dotenv").config();
let fs = require("fs");

let axios = require("axios");
let moment = require("moment");

const divider = "\n\n=================================\n\n"
let keys = require("./keys.js");
let Spotify = require("node-spotify-api");

var spotify = new Spotify(keys.spotify);

let queryType = process.argv[2];
let query = process.argv.slice(3).join(' ');


// function doStuff(command){

// }
if (queryType == "concert-this") {
    concertThis(query);

} else if (queryType == "spotify-this-song") {
    spotifyThis(query);
   
} else if(queryType == "movie-this") {
    movieThis(query);
}else if (queryType == "do-what-it-says") {
    doWhatItSays();
}


function concertThis(bandName){
    console.log("Searching concerts for " + bandName);

    axios.get('https://rest.bandsintown.com/artists/' + bandName + '/events?app_id=codingbootcamp')
    .then(function(response) {
        console.log(divider);
        console.log('Venue: ' + response.data[0].venue.name);
        console.log('Location: ' + response.data[0].venue.city + ', ' + response.data[0].venue.region)
        console.log('Time: ' + moment(response.data[0].datetime).format('M/D/YYYY hh:mm A'));
        console.log(divider);

    });
};

function spotifyThis(songName) {
    console.log("Searching for the song " + '"' + songName +'"');

    if (!query == ''){
        spotify.search({ type: 'track', query: songName }, function(err, data) {
            if (err) {
              return console.log('Error occurred: ' + err);
            }
          let songs = data.tracks.items[0];  
        //   console.log(songs); 
          console.log(divider);  
          console.log(`Song name: ` + songs.name); 
          console.log(`By: ` + songs.album.artists[0].name); 
          console.log(`Preview link: ` + songs.external_urls.spotify); 
          console.log(`Album name: ` + songs.album.name);
          console.log(divider);
          });
    } else {
        spotify.search({ type: 'track', query: "The Sign" }, function(err, data) {
            if (err) {
              return console.log('Error occurred: ' + err);
            }
          let songs = data.tracks.items[0];  
          console.log(divider);  
          console.log(`Song name: ` + songs.name); 
          console.log(`By: ` + songs.album.artists[0].name); 
          console.log(`Preview link: ` + songs.external_urls.spotify); 
          console.log(`Album name: ` + songs.album.name);
          console.log(divider);
          });
    }
}
function movieThis(movieName) {
    movieName = movieName.replace(" ", "+");
    console.log("Searching movie title " + movieName);

    axios.get('http://www.omdbapi.com/?apikey=trilogy&t=' + movieName)
    .then(function(response){
        console.log(divider);
        console.log('Movie Title: ' + response.data.Title);
        console.log('Year Released: ' + response.data.Year);
        console.log('IMDB Rating: ' + response.data.imdbRating);
        console.log('Rotten Tomatoes Score: ' + response.data.Ratings[1].Value);
        console.log('Country: ' + response.data.Country);
        console.log('Language: ' +response.data.Language);
        console.log('Plot: ' + response.data.Plot);
        console.log('Actors: ' + response.data.Actors);
        console.log(divider);
    })
}

function doWhatItSays() {
    console.log("Searching from txt file");

    fs.readFile('random.txt', 'utf8', function(err, data) {
        if (err) {
            throw err;
        }
        
        thisSearch = data.split(',');
        queryType = thisSearch[0];
        query = thisSearch[1];
        

        switch(queryType) {
            case 'spotify-this-song':
                spotifyThis(query);
                break;
            case 'movie-this':
                movieThis(query);
                break;
            case 'concert-this':
                concertThis(query);
                break;
        }
    });
}