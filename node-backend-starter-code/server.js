/**
 * Created by jnaadjie on 9/6/15.
 */
var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var path = require('path');
var utilities = require('./utilities');

var port = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/favorites', function(req, res) {
  var data = fs.readFileSync('./data.json');
  res.setHeader('Content-Type', 'application/json');
  res.send(data)
});

app.post('/favorites', function (req, res, done) {
	movie = req.body;
	var data = JSON.parse(fs.readFileSync('./data.json'));
	if (utilities.contains(data, movie)) {
		res.send("movie already saved");
		done()
	} else {
		data.push(movie);
		fs.writeFile('./data.json', JSON.stringify(data));
		res.setHeader('Content-Type', 'application/json');
		res.sendStatus(200);
		done()
	}
});

app.listen(port, function(){
  console.log("Listening on port " + port);
});