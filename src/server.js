const http = require('http');
const httpResponses = require('./httpResponses.js');
const dataResponses = require('./dataResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': httpResponses.getIndex,
  '/style.css': httpResponses.getCSS,
  '/success': dataResponses.success,
  '/badRequest': dataResponses.badRequest,
  '/unauthorized': dataResponses.unAuthorized,
  '/forbidden': dataResponses.forbidden,
  '/internal': dataResponses.internal,
  '/notImplemented': dataResponses.notImplemented,
  notFound: dataResponses.notFound,
  index: httpResponses.getIndex,
};

const onRequest = (request, response) => {
  // Parse URL
  const protocol = request.connection.encrypted ? 'https' : 'http';
  const parsedURL = new URL(request.url, `${protocol}://${request.headers.host}`);
  // Store Acceptance Headers and Query Parameters inside the request
  request.acceptedTypes = request.headers.accept.split(',');
  request.queryParams = Object.fromEntries(parsedURL.searchParams);
  if (urlStruct[parsedURL.pathname]) {
    // If the url exists
    urlStruct[parsedURL.pathname](request, response);
  } else {
    // default line
    urlStruct.notFound(request, response);
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on: 127.0.0.01:${port}`);
});
