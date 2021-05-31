var http = require('http');

var PORT = 8080;

function onRequestHandler(request, response) {
  var headers = {
    'Content-Type': 'application/json',
  };

  var content = {};

  // Chain cors -> parseData -> handler
  cors();

  function handler() {
    var statusCode = 200;
    content.status = 1;
    content.errors = [];

    if (request.postData) {
      if (request.postData.indexOf('error500') > -1) {
        statusCode = 500;
      }

      if (request.postData.indexOf('errorEmail') > -1) {
        statusCode = 500;
        content.errors.push({name: 'email', error: 'Is this an email address?'});
      }
    }

    if (statusCode !== 200) {
      content.status = 0;
      content.errorMessage = 'Failed to submit your form details';
    }

    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(content), 'utf-8');
  }

  function cors() {
    var origin = request.headers.origin ? request.headers.origin : false;

    if (origin) {
      headers['Access-Control-Allow-Origin'] = origin;
      headers['Access-Control-Allow-Methods'] = 'GET,POST';
    }

    parseData();
  }

  function parseData(next) {
    if (request.method !== 'POST') {
      return handler();
    }

    var body = '';

    request.on('data', function(data) {
      body += data;
    });

    request.on('end', function() {
      request.postData = body;
      handler();
    });
  }
}

module.exports = function() {
  var server = http.createServer(onRequestHandler);
  server.listen(PORT);

  return {
    server: server,
    port: PORT,
  };
};
