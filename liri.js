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
		console.log("soon");
		break;

	case "do-what-it-says":
		console.log("soon");
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
			console.log("Oops, an error occured! + error: " + error);
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
			console.log("Oops, an error occured! + error: " + error);
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
}
	