var fs = require('fs');

setInterval(function () {
  fs.writeFileSync('db.json', JSON.stringify(module.exports.db));
}, 1000);

module.exports = {

  db: (function () {
    if (fs.existsSync('db.json')) {
      return require('./db.json');
    } else {
      return {};
    }
  })(),

  handler: function(request, response) {
    console.log('Serving request type ' + request.method + ' for url ' + request.url);

    var isRoom = request.url.split('/')[1] === 'classes';
    var room = request.url.split('/')[2];

    if (isRoom && request.method === 'GET') {

      var statusCode = 200;
      var headers = defaultCorsHeaders;

      headers['Content-Type'] = 'application/json';

      response.writeHead(statusCode, headers);

      module.exports.db[room] = module.exports.db[room] || [];
      response.end(JSON.stringify({results: module.exports.db[room]}));

    } else if (isRoom && request.method === 'POST') {

      var statusCode = 201;
      var message = '';

      request.on('data', function (chunk) {
        message += chunk;
      });

      request.on('end', function () {
        message = JSON.parse(message);
        module.exports.db[room] = module.exports.db[room] || [];
        message.objectId = module.exports.db[room].length;
        message.createdAt = new Date();
        module.exports.db[room].unshift(message);

        var headers = defaultCorsHeaders;

        headers['Content-Type'] = 'application/json';

        response.writeHead(statusCode, headers);

        response.end(JSON.stringify(message));
      });
    } else if (request.method === 'OPTIONS') {
      var statusCode = 200;
      var headers = defaultCorsHeaders;

      headers['Content-Type'] = 'application/json';

      response.writeHead(statusCode, headers);

      response.end(JSON.stringify({status: 'ok', message: 'CORS allowed'}));
    } else {
      var statusCode = 404;
      var headers = defaultCorsHeaders;

      headers['Content-Type'] = 'application/json';

      response.writeHead(statusCode, headers);

      response.end(JSON.stringify({status: 'error', message: 'File not found'}));
    }

  }
};

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};
