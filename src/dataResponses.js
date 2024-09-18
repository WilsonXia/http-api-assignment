const handleResponse = (request, response, code, type, data) => {
  // XML is already a string, so stringify if its json
  const stringData = type === 'application/json' ? JSON.stringify(data) : data;
  const options = {
    'Content-Type': type,
    'Content-Length': Buffer.byteLength(stringData, 'utf8'),
  };

  response.writeHead(code, options);
  response.write(stringData);
  response.end();
};

const checkQueryParam = (request, key, trueValue, errorCode) => {
  // Check query parameter
  if (request.queryParams[key] && request.queryParams[key] === trueValue) {
    return 200;
  }
  return errorCode;
};

const handleCheck = (request, response, code, messageStr) => {
  let data;
  // Handle the response depending on what was asked
  if (request.acceptedTypes[0] === 'text/xml') {
    // XML Response
    data = `<response> <message>${messageStr}</message> </response>`;
    handleResponse(request, response, code, 'text/xml', data);
  } else {
    // JSON Response, default
    data = { response: messageStr };
    handleResponse(request, response, code, 'application/json', data);
  }
};

const handleCheckWithID = (request, response, code, messageStr, id) => {
  let data;
  // Handle the response depending on what was asked
  if (request.acceptedTypes[0] === 'text/xml') {
    // XML Response
    data = `<response><message>${messageStr}</message></response>`;
    handleResponse(request, response, code, 'text/xml', data);
  } else {
    // JSON Response
    data = { response: messageStr, id };
    handleResponse(request, response, code, 'application/json', data);
  }
};

const success = (request, response) => {
  handleCheck(request, response, 200, 'This is a success message');
};

const badRequest = (request, response) => {
  let message = 'This is a bad request. The \'valid\' query parameter is not set to \'true\'.';
  const code = checkQueryParam(request, 'valid', 'true', 400);
  if(code === 200){
    message = `'valid' has been set to 'true'.`;
    handleCheck(request, response, code, message);
  } else {
    handleCheckWithID(request, response, code, message, 'badRequest');
  }
};

const unAuthorized = (request, response) => {
  let message = 'This is an unauthorized message. The \'loggedIn\' query parameter is not set to \'yes\'.';
  const code = checkQueryParam(request, 'loggedIn', 'yes', 401);
  if(code === 200){
    message = 'This user has logged in';
    handleCheck(request, response, code, message);
  }
  else{
    handleCheckWithID(request, response, code, message, 'unauthorized');
  }
};

const forbidden = (request, response) => {
  // let data;
  const code = 403;
  handleCheckWithID(request, response, code, 'This is a forbbiden page.', 'forbidden');
};

const internal = (request, response) => {
  const code = 500;
  handleCheckWithID(request, response, code, 'There was an internal server error, please try again.', 'internal');
};

const notImplemented = (request, response) => {
  const code = 501;
  handleCheckWithID(request, response, code, 'This code has not been implemented yet.', 'notImplemented');
};

const notFound = (request, response) => {
  const code = 404;
  handleCheckWithID(request, response, code, 'This page does not exist :/', 'notFound');
};

module.exports = {
  success,
  badRequest,
  unAuthorized,
  forbidden,
  internal,
  notImplemented,
  notFound,
};
