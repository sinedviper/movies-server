import express from "express";
import { graphqlHTTP } from "express-graphql";
import mongoose from "mongoose";
import cors from "cors";

import schema from "./schema/schema.js";

const app = express();
const port = 3005;

mongoose.connect(
  "mongodb+srv://admin:889668@cluster0.oxzfz2e.mongodb.net/?retryWrites=true&w=majority"
);

app.use(cors());

app.use("/graphql", graphqlHTTP({ schema, graphiql: true }));

const dbConnection = mongoose.connection;
dbConnection.on("error", (err) => console.log(`Connection error: ${err}`));
dbConnection.once("open", () => console.log("Connected to DB!"));

app.listen(port, (err) => {
  err
    ? console.log(err)
    : console.log("Server starter! http://localhost:3005/");
});
