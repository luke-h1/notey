/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcryptjs';
import { ObjectIdLike } from 'bson';
import { Db, ObjectId } from 'mongodb';
import signToken from '../utils/jwt/signToken';
import logger from '../utils/logger';
import { LoginInput, RegisterInput, User } from '../utils/types';

/* eslint-disable @typescript-eslint/no-unused-vars */
const resolvers = {
  Query: {
    myTaskLists: async (
      _: any,
      __: any,
      { db, user }: { db: Db; user: User },
    ) => {
      if (!user) {
        throw new Error('Auth error, please login');
      }

      return db.collection('TaskList').find({ userIds: user._id }).toArray();
    },

    getTaskList: async (
      _: any,
      { id }: { id: string },
      { db, user }: { db: Db; user: User },
    ) => {
      if (!user) {
        throw new Error('Auth error, please login');
      }

      return db.collection('TaskList').findOne({ _id: new ObjectId(id) });
    },
  },
  Mutation: {
    register: async (
      _: any,
      { input }: { input: RegisterInput },
      { db }: { db: Db },
    ) => {
      const hashedPassword = bcrypt.hash(input.password, 10);

      const result = (await db.collection('Users').insertOne(
        {
          ...input,
          hashedPassword,
        },
        {},
        () => {
          logger.info('User created');
        },
      )) as unknown as any;

      const user = result.ops[0];

      return {
        user,
        token: signToken(user.id),
      };
    },

    login: async (
      _: any,
      { input }: { input: LoginInput },
      { db }: { db: Db },
    ) => {
      const user = (await db
        .collection('Users')
        .findOne({ email: input.email })) as User;

      const valid = await bcrypt.compare(input.password, user.password);

      if (!user || !valid) {
        throw new Error('Invalid credentials');
      }

      return {
        user,
        token: signToken(user),
      };
    },

    createTaskList: async (
      _: any,
      { title }: { title: string },
      { db, user }: { db: Db; user: User },
    ) => {
      if (!user) {
        throw new Error('Authentication Error. Please sign in');
      }

      const newTaskList = {
        title,
        createdAt: new Date().toISOString(),
        userIds: [user._id],
      };

      const result = (await db
        .collection('TaskList')
        .insertOne(newTaskList, {}, () => {
          logger.info('task list created');
        })) as unknown as any;

      return result.ops[0];
    },

    updateTaskList: async (
      _: any,
      { id, title }: { id: string; title: string },
      { db, user }: { db: Db; user: User },
    ) => {
      if (!user) {
        throw new Error('Authentication Error. Please sign in');
      }

      await db.collection('TaskList').updateOne(
        {
          _id: new ObjectId(id),
        },
        {
          $set: {
            title,
          },
        },
      );

      return db.collection('TaskList').findOne({ _id: new ObjectId(id) });
    },
    addUserToTaskList: async (
      _: any,
      { taskListId, userId }: { taskListId: string; userId: string },
      { db, user }: { db: Db; user: User },
    ) => {
      if (!user) {
        throw new Error('Authentication Error. Please sign in');
      }

      const taskList = await db
        .collection('TaskList')
        .findOne({ _id: new ObjectId(taskListId) });

      if (!taskList) {
        return null;
      }
      if (
        taskList.userIds.find(
          (dbId: { toString: () => any }) =>
            dbId.toString() === userId.toString(),
        )
      ) {
        return taskList;
      }

      await db.collection('TaskList').updateOne(
        {
          _id: new ObjectId(taskListId),
        },
        {
          $push: {
            userIds: new ObjectId(userId),
          },
        },
      );
      taskList.userIds.push(new ObjectId(userId));
      return taskList;
    },

    deleteTaskList: async (
      _: any,
      { id }: { id: string },
      { db, user }: { db: Db; user: User },
    ) => {
      if (!user) {
        throw new Error('Authentication Error. Please sign in');
      }

      await db.collection('TaskList').deleteOne({ _id: new ObjectId(id) });

      return true;
    },

    createTodo: async (
      _: any,
      { content, taskListId }: { content: string; taskListId: string },
      { db, user }: { db: Db; user: User },
    ) => {
      if (!user) {
        throw new Error('Authentication Error. Please sign in');
      }

      const newTodo = {
        content,
        taskListId: new ObjectId(taskListId),
        completed: false,
      };

      const result = (await db
        .collection('Todo')
        .insertOne(newTodo)) as unknown as any;
      return result.ops[0];
    },

    updateTodo: async (
      _: any,
      data: {
        id:
          | string
          | number
          | ObjectId
          | ObjectIdLike
          | Buffer
          | Uint8Array
          | undefined;
      },
      { db, user }: { db: Db; user: User },
    ) => {
      if (!user) {
        throw new Error('Authentication Error. Please sign in');
      }

      await db.collection('Todo').updateOne(
        {
          _id: new ObjectId(data.id),
        },
        {
          $set: data,
        },
      );
      return db.collection('Todo').findOne({ _id: new ObjectId(data.id) });
    },

    deleteTodo: async (
      _: any,
      { id }: { id: string },
      { db, user }: { db: Db; user: User },
    ) => {
      if (!user) {
        throw new Error('Authentication Error. Please sign in');
      }

      await db.collection('Todo').deleteOne({ _id: new ObjectId(id) });

      return true;
    },
  },
  User: {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    id: ({ _id, id }) => _id || id,
  },

  Todo: {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    id: ({ _id, id }) => _id || id,
    taskList: async (
      { taskListId }: { taskListId: string },
      _: any,
      { db }: { db: Db },
    ) =>
      // eslint-disable-next-line no-return-await
      await db
        .collection('TaskList')
        .findOne({ _id: new ObjectId(taskListId) }),
  },

  TaskList: {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    id: ({ _id, id }) => _id || id,

    progress: async (
      { _id }: { _id: ObjectId },
      _: any,
      { db }: { db: Db },
    ) => {
      const todos = await db
        .collection('Todo')
        .find({
          taskListId: new ObjectId(_id),
        })
        .toArray();

      const completedTodos = todos.filter(todo => todo.completed);

      if (todos.length === 0) {
        return 0;
      }
      return (100 * completedTodos.length) / todos.length;
    },

    users: async (
      { userIds }: { userIds: string[] },
      _: any,
      { db }: { db: Db },
    ) => {
      return db
        .collection('Users')
        .find({
          _id: {
            $in: userIds.map(id => new ObjectId(id)),
          },
        })
        .toArray();
    },

    todos: async ({ _id }: { _id: ObjectId }, _: any, { db }: { db: Db }) => {
      return db
        .collection('Todo')
        .find({ taskListId: new ObjectId(_id) })
        .toArray();
    },
  },
};

export default resolvers;
