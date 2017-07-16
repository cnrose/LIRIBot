//required packages
var fs = require("fs");
var Twitter = require ("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");

//get Twitter keys from keys.js
var keys = require("./keys.js");
var myKeys = keys.twitterKeys;

//get Spotify Credentials from keys.js
var creds = keys.spotifyCreds;

//process user input
var command = process.argv[2];
var nodeArgs = process.argv;
var searchTerm = "";

for (var i = 3; i < nodeArgs.length; i++) {
	if (i > 3 && i < nodeArgs.length) {
		searchTerm = searchTerm + "+" + nodeArgs[i];
	} else {
		searchTerm += nodeArgs[i];
	}
};

//switch function for command options
switch (command) {
	case "my-tweets":
		getTweets();
		break;

	case "spotify-this-song":
		if (searchTerm) {
			querySong(searchTerm);
		} else {
			querySong("The Sign Ace of Base");
		}
		break;

	case "movie-this":
		if (searchTerm) {
			queryMovie(searchTerm);
		} else {
			queryMovie("Mr. Nobody");
		}
		break;

	case "do-what-it-says":
		doThisThing();
		break;			
}


//twitter function
function getTweets() {
	var client = new Twitter(myKeys);
	var parameters= {
		screen_name: 'caitlinscoding',
		count: '20'
	};
	client.get("statuses/user_timeline", parameters, function(error, tweets, response) {
		if(error){
			console.log("Oops, an error occured! Error: " + error);
		} else {
			for (var i = 0; i < tweets.length; i++){
				var date = tweets[i].created_at;
				console.log("@caitlinscoding tweeted " + tweets[i].text + " at " + date);
			};
		};
	})
};

//spotify function
function querySong(track) {
	var spotify = new Spotify(creds);
	
	
	spotify.search({type: 'track', query: track, limit: '1'}, function(err, data){
		if (err){
			console.log("Oops, an error occured! Error: " + error);
		} else {
			var song = data.tracks.items[0].name;
			var artist = data.tracks.items[0].artists[0].name;
			var album = data.tracks.items[0].album.name;
			var preview = data.tracks.items[0].preview_url;	
				
			console.log("Song: " + song);
			console.log("Artist: " + artist);
			console.log("Album: " + album);
			console.log("Preview at: " + preview);
				
		};
	});		
};

//OMDB function
function queryMovie(movie) {
	var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=40e9cece";

	request(queryUrl, function(error, response, body) {
		if (error) {
			console.log("Oops, an error occured! " + error);
		} else {
			console.log("Title: " + JSON.parse(body).Title);
			console.log("Release Year: " + JSON.parse(body).Year);
			console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
			console.log("Rotton Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
			console.log("Country of Production: " + JSON.parse(body).Country);
			console.log("Language: " + JSON.parse(body).Language);
			console.log("Plot: " + JSON.parse(body).Plot);
			console.log("Actors: " + JSON.parse(body).Actors);
		}

		if (movie === "Mr. Nobody") {
			console.log("****************");
			console.log("If you haven't watched Mr. Nobody, then you should: http://www.imdb.com/title/tt0485947/");
			console.log("It's on Netflix!");
		};
	});
};

//do what it says function
function doThisThing() {
	fs.readFile("random.txt", "utf8", function(error, data){
		if(error){
			console.log("Oops, an error occured! Error: " + error);
		} else {
			var splitData = data.split(",");

			querySong(splitData[1]);
		};
	});
};