// Load npm request packages
var request = require('request');

// Load npm moment packages
var moment = require('moment-timezone');

// Initialize spotify api
// https://www.npmjs.com/package/node-spotify-api
var Spotify = require('node-spotify-api');
 
var spotify = new Spotify({
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
});

// Initialize twitter api
// https://www.npmjs.com/package/twitter
var Twitter = require('twitter');
 
var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// Grab command line
var command = process.argv[2].toLowerCase();
var title = process.argv[3];

// Main switch function to handle different commands
switch (command) {

	case 'my-tweets':
		myTweets();
		break;

	case 'spotify-this-song':
		spotifyThis();
		break;

	case 'movie-this':
		movieThis();
		break;

	case 'do-what-it-says':
		randomThing();
		break;

	default:
		console.log('LIRI ONLY takes one of the following commands:: my-tweets, spotify-this-song, movie-this, do-what-it-says');
		console.log('Please try again:)');
		break;
}

// display my last 20 tweets
function myTweets() {

	//parameters for get request
	var params = {screen_name: 'zzang_minsoo', count: 20}

	//parameters for moment
	var dateFormat = 'dddd MMM D hh:mm:ss';
	var region = 'America/Los_Angeles';

	// get recent 20 tweets in my timeline
	client.get('statuses/user_timeline', params, function(error, tweets, response) {

		// If there is no error
		if (!error) {
			
			for(var i=0; i<tweets.length; i++) {

				// twitter data object
				var tweet = tweets[i];

				// change twitter time to our timezone
				var timezoneParsed = moment.tz(tweet.created_at, dateFormat, region);


				// Display Tweets
				console.log(' ');
				console.log(tweet.user.name + ' @' + tweet.user.screen_name + ' | ' + timezoneParsed);
				console.log(tweet.text);
				console.log(' ');

			}
		}
	});
}

function spotifyThis() {
	/*
		- Artist(s)
		- The song's name
		- A preview link of the song from Spotify
		- The album that the song is from
	*/

	var songTitle = title;
	var params = { type: 'track', query: songTitle, limit: 2 };

	spotify.search( params, function (err, data) {

		if (err) {
			console.log('Error occurred: ' + err );
			return;
		}

		var trackData = data.tracks.items;

		for ( var i=0; i<trackData.length; i++ ) {

			var artists = '';
			var previewURL = '';
			var extendedURL = '';

			// Concatenates to artists string
			for ( var j=0; j<trackData[i].artists.length; j++ ) {
				artists = artists + ', ' + trackData[i].artists[j].name
			}

			if (trackData[i].preview_url === null) {
				previewURL = 'Not Available';
			} else {
				previewURL = trackData[i].preview_url;
			}

			// console.log(trackData[i])
			console.log(' ');
			// remove first two ', ' from artists
			console.log('Artist(s):  ' + artists.substr(2));
			console.log("The song's name:  " + trackData[i].name);
			console.log('Preview URL:  ' + previewURL);
		}
	})
}

function movieThis() {

	console.log(' ');

	// store console input in variable
	var movieTitle = title;

	// parse it to use in search query
	var movieTitleParsed = movieTitle.split(" ").join("+").toLowerCase();

	// build query URL
	var queryUrl = "http://www.omdbapi.com/?t=" + movieTitleParsed + "&y=&plot=short&apikey=" + KEYS.omdbKey.api_key;

	console.log('Movie Title: ' + movieTitle);
	console.log('Query URL: ' + queryUrl);

	request(queryUrl, function (err, response, body) {

		// If the request is successful
		if (!err && response.statusCode === 200) {

			// Movie data object
			var movieData = JSON.parse(body);

			// Display movie info
			console.log('======================================= OMDB ============================================');
			console.log(' ')
			console.log('*  Movie Title:              ' + movieData.Title);
			console.log('*  Released:                 ' + movieData.Released);
			console.log('*  IMDB Rating:              ' + movieData.Ratings.find( x => x.Source === 'Internet Movie Database').Value);
			console.log('*  Rotten Tomatoes Rating:   ' + movieData.Ratings.find( x => x.Source === 'Rotten Tomatoes').Value);
			console.log('*  Country:                  ' + movieData.Country);
			console.log('*  Laguage:                  ' + movieData.Laguage);
			console.log('*  Plot:                     ' + movieData.Plot);
			console.log('*  Actors:                   ' + movieData.Actors);
			console.log(' ');
			console.log('==========================================================================================');
			console.log(' ')
		
		} 

	});
}

function randomThing() {
	console.log('do-what-it-says');
}