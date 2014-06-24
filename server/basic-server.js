http = require("http");
requestHandler = require('./request-handler');

var port = 3010;
var ip = "127.0.0.1";

var server = http.createServer(requestHandler.handler);

console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);