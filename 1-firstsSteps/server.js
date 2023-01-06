const http = require("http"); //To include the HTTP module and allows to transfer data over the HTTP
const app = require("./app"); // request handler
const port = process.env.PORT || 5000; //it would be set by environment|server where will be deployed on if it is not set then we should use (3000) port
const server = http.createServer(app); //to create Server we need to pass to a listener what would be executed whenever we get a new request

server.listen(port); //starts a server
