import '@babel/polyfill';
import { GraphQLServer, PubSub } from 'graphql-yoga';
import prisma from './prisma';
import { resolvers, fragmentReplacements } from './resolvers';

const pubSub = new PubSub();

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context(request) {
    return { pubSub, prisma, request };
  },
  fragmentReplacements
});

const PORT = process.env.PORT || 4000;
server.start({ PORT }, () => {
  console.log('Server is up');
});
