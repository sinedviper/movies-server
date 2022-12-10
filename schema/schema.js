import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean,
} from "graphql";

import Movie from "../models/movie.js";
import Director from "../models/director.js";

const MovieType = new GraphQLObjectType({
  name: "Movie",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    genre: { type: new GraphQLNonNull(GraphQLString) },
    director: {
      type: DirectorType,
      resolve({ directorId }, args) {
        return Director.findById(directorId).populate({
          path: "directors",
          strictPopulate: false,
        });
      },
    },
    rate: { type: GraphQLInt },
    watched: { type: new GraphQLNonNull(GraphQLBoolean) },
  }),
});

const DirectorType = new GraphQLObjectType({
  name: "Director",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    age: { type: new GraphQLNonNull(GraphQLInt) },
    movies: {
      type: new GraphQLList(MovieType),
      resolve({ id }, args) {
        return Movie.find({ directorId: id });
      },
    },
  }),
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addDirector: {
      type: DirectorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, { name, age }) {
        const director = new Director({
          name,
          age,
        });
        return director.save();
      },
    },
    addMovie: {
      type: MovieType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        directorId: { type: GraphQLID },
        rate: { type: GraphQLInt },
        watched: { type: new GraphQLNonNull(GraphQLBoolean) },
      },
      resolve(parent, { name, genre, directorId, rate, watched }) {
        const movie = new Movie({
          name,
          genre,
          directorId,
          rate,
          watched,
        });
        return movie.save();
      },
    },
    deleteDirect: {
      type: DirectorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, { id }) {
        return Director.findByIdAndDelete(id);
      },
    },
    deleteMovie: {
      type: MovieType,
      args: { id: { type: GraphQLID } },
      resolve(parent, { id }) {
        return Movie.findByIdAndDelete(id);
      },
    },
    updateDirector: {
      type: DirectorType,
      args: {
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, { id, name, age }) {
        return Director.findByIdAndUpdate(
          id,
          {
            $set: {
              name,
              age,
            },
          },
          { new: true }
        );
      },
    },
    updateMovie: {
      type: MovieType,
      args: {
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        directorId: { type: GraphQLID },
        rate: { type: GraphQLInt },
        watched: { type: new GraphQLNonNull(GraphQLBoolean) },
      },
      resolve(parent, { id, name, genre, directorId, rate, watched }) {
        return Movie.findByIdAndUpdate(
          id,
          {
            $set: {
              name,
              genre,
              directorId,
              rate,
              watched,
            },
          },
          { new: true }
        );
      },
    },
  },
});

const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    movie: {
      type: MovieType,
      args: { id: { type: GraphQLID } },
      resolve(parent, { id }) {
        return Movie.findById(id);
      },
    },
    director: {
      type: DirectorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, { id }) {
        return Director.findById(id);
      },
    },
    movies: {
      type: new GraphQLList(MovieType),
      args: { name: { type: GraphQLString } },
      resolve(parent, { name }) {
        return Movie.find({ name: { $regex: String(name), $options: "i" } });
      },
    },
    directors: {
      type: new GraphQLList(DirectorType),
      args: { name: { type: GraphQLString } },
      resolve(parent, { name }) {
        return Director.find({ name: { $regex: String(name), $options: "i" } });
      },
    },
  },
});

export default new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
