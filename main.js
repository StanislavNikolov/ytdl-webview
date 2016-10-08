var app = require("express")();
var cp = require("child_process").exec;
var fs = require("fs");

var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
	res.sendFile(__dirname + "/index.html");
});

app.get('/file/*.mp4', function(req, res) {
	var fn = req.url.substr(6, req.url.length);
	res.sendFile(__dirname + "/downloads/" + fn);
});

var status = {};

app.get('/check/*.mp4', function(req, res) {
	var str = req.url;
	var cut = str.substr(7, str.length-7-4);

	var ok = false;
	console.log('here', cut, status, status[cut]);
	if(status[cut] === true) res.send('o');
	else res.send('x');
});

var port = process.env.PORT || 3000;
var server = app.listen(port, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log("Starting server on http://%s:%s", host, port);
});

app.post("/", function(req, res) {
	var id = Math.random().toString(36).substring(7);

	status[id] = false;
	var command = __dirname + "/doit.sh " + req.body.url + " " + id;

	var response = "";
	fs.readFile(__dirname + "/response.html", 'utf8', function(err, data) {
		data = data.split("__REPLC__FNAME__").join(id + ".mp4");
		res.send(data);
	});

	cp(command, function(err, stdout, stderr) {
		status[id] = true;
	});

});

