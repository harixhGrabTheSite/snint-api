const express = require('express');
const http = require('http');
const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const cors = require('cors'); // Add this line

const typeDefs = require('./src/schema');
const resolvers = require('./src/resolver');

async function startApolloServer(typeDefs, resolvers) {
    const app = express();
    app.use(cors()); // Use the cors middleware
    app.use('/uploads', express.static('src/images'));
    const httpServer = http.createServer(app);
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });
    await server.start();
    server.applyMiddleware({ app, bodyParserConfig: true });
    await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve));
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer(typeDefs, resolvers);
