
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('announcements.json'); // Use the name of your JSON file
const middlewares = jsonServer.defaults();

const port = 8000; // Choose any available port

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.use(router);

server.listen(port, () => {
    console.log(`JSON Server is running on port ${port}`);
});