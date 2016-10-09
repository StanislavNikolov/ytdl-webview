var app = require("express")();
var cp = require("child_process").exec;
var fs = require("fs");

var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
	res.sendFile(__dirname + "/index.html");
});
app.get("/style.css", function(req, res) {
	res.sendFile(__dirname + "/style.css");
});

app.get('/file/*.mp(3|4)', function(req, res) {
	var fn = req.url.substr(6, req.url.length);
	res.sendFile(__dirname + "/downloads/" + fn);
});

var finished = {};
var status = {};
function getStatus(id)
{
	if(finished[id] === true) return true;
	else return false;
}

app.get('/check/*.mp(3|4)', function(req, res) {
	var str = req.url;
	var cut = str.substr(7, str.length-7-4);

	var toSend = getStatus(cut) ? "o" : "x";
	if(status[cut] != null) toSend += status[cut];
	res.send(toSend);
});

var port = process.env.PORT || 3000;
var server = app.listen(port, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log("Starting server on http://%s:%s", host, port);
});

function readLog(id)
{
	if(getStatus(id)) return;
	fs.readFile(__dirname + "/downloads/" + id + ".log", 'utf8', function(err, data) {
		if(err) { return; }
		data = data.split("\n");
		for(var line of data)
		{
			if(line.length > 10
				&& line.substr(0, 10) == "[download]"
				&& line.search("Destination") == -1)
			{
			var fixed = line.substr(10, line.length).trim();
			status[id] = fixed.substr(0, fixed.search("%"));
			}
		}
	});
	setTimeout(readLog, 1000, id);
}

app.post("/", function(req, res) {
	var id = Math.random().toString(36).substring(7);

	var format = "4";
	if(req.body.format === "3") format = "3";

	finished[id] = false;
	var command = __dirname + "/doit.sh " + req.body.url + " " + id + " " + format;

	var response = "";
	fs.readFile(__dirname + "/response.html", 'utf8', function(err, data) {
		data = data.split("__REPLC__FNAME__").join(id + ".mp" + format);
		res.send(data);
	});

	cp(command, function(err, stdout, stderr) {
		finished[id] = true;
	});

	readLog(id);
});

