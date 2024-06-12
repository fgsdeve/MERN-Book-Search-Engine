const express = require('express');
const { ApolloServer } = require('@apollo/server');
const path = require('path');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const { authMiddleware } = require('./utils/auth');
const { expressMiddleware } = require("@apollo/server/express4");

const app = express();
const PORT = process.env.PORT || 3001;



async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware,
  });


  await server.start();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use("/graphql", expressMiddleware(server, {context: authMiddleware}));

  if (process.env.NODE_ENV === 'production') {
    console.log("PRODUCTION")

    app.use(express.static(path.join(__dirname, '../client/dist')));
  
  app.get('*', (req, res) => {
    console.log("HOMEPAGE")
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});
}

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
}

startApolloServer();
