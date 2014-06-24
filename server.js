var http = require('http');
var requestHandler = require('./server/request-handler');

var port = process.env.PORT || 3010;
var ip = "127.0.0.1";

var server = http.createServer(requestHandler.handler);

console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);