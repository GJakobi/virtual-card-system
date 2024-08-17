export const typeDefs = `#graphql
  type User {
    id: ID!
    username: String!
    email: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    users: [User!]!
    me: User
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): User!
    login(email: String!, password: String!): AuthPayload!
  }
`;
