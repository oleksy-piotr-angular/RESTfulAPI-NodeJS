const http = require('http');
const app = require('./app');// request handler

const port = process.env.PORT || 5000;//it would be set by enviroment|server where will be deployed on if it is not set then we shoul use (3000) port

const server = http.createServer(app);//to create Server we need to pass a listener which would be executed whenever we get a new request

server.listen(port);//starts a server