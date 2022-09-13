import { gql } from 'apollo-server';

const typeDefs = gql`
  type Query {
    myTaskLists: [TaskList!]!
    getTaskList(id: ID!): TaskList
  }

  type Mutation {
    register(input: RegisterInput!): AuthUser!
    login(input: LoginInput!): AuthUser!

    createTaskList(title: String!): TaskList!
    updateTaskList(id: ID!, title: String!): TaskList!
    deleteTaskList(id: ID!): Boolean!

    addUserToTaskList(taskListId: ID!, userId: ID!): TaskList!

    createTodo(content: String!, taskListId: ID!): Todo!
    updateTodo(id: ID!, content: String, completed: Boolean): Todo!
    deleteTodo(id: ID!): Boolean!
  }

  input RegiserInput {
    email: String!
    password: String!
    name: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type AuthUser {
    user: User!
    token: string!
  }

  type User {
    id: ID!
    name: String!
    email: String!
  }

  type TaskList {
    id: ID!
    title: String!
    progress: Float!

    users: [User!]!
    todos: [Todo]!

    createdAt: String!
  }

  type Todo {
    id: ID!
    content: String!
    completed: Boolean!
    taskList: TaskList!
  }
`;
