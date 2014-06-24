var http = require('http');
var requestHandler = require('./server/request-handler').handler;

var port = process.env.PORT || 3010;
var ip = "127.0.0.1";

var server = http.createServer(requestHandler);

console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);