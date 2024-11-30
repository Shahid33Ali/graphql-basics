const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const bodyParser = require("body-parser");
const cors = require("cors");
const { default: axios } = require("axios");
async function server() {
  const app = express();
  const server = new ApolloServer({
    typeDefs: `
    type User{
    id: ID!
    name: String!
    username: String!
    email: String!
    phone: String!
    website: String!
    } 

    type Todo{
    id: ID!
    user:User!
    userId:ID!
    title: String!
    completed: Boolean
    }
     type Query{
     getTodos:[Todo]
     getAllUsers:[User]
     }
    `,
    resolvers: {
      Todo: {
        user: async (todo) =>
          (
            await axios.get(
              `https://jsonplaceholder.typicode.com/users/${todo.userId}`
            )
          ).data,
      },
      Query: {
        getTodos: async () => {
          const data = await axios.get(
            "https://jsonplaceholder.typicode.com/todos"
          );
          return data.data;
        },
        getAllUsers: async () => {
          const data = await axios.get(
            "https://jsonplaceholder.typicode.com/users"
          );
          return data.data;
        },
      },
    },
  });
  app.use(bodyParser.json());
  app.use(cors());
  await server.start();
  app.use("/graphql", expressMiddleware(server));
  app.listen(4001, () => {
    console.log("Server started at port 3000");
  });
}
server();
