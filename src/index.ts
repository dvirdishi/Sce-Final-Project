
import Server from './server';
import Connection from './connection';

Connection.connectToMongo();

const server = new Server(3003);
server.listen();