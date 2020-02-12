import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import getUserId from '../utils/getUserId';

const Mutation = {
  async login(parent, args, { prisma }, info) {
    const user = await prisma.query.user({
      where: {
        email: args.data.email
      }
    });

    if (!user) {
      throw new Error('User does not exist for that email');
    }

    const isMatch = await bcrypt.compare(args.data.password, user.password);

    if (!isMatch) {
      throw new Error('Wrong password');
    }

    return {
      user,
      token: jwt.sign({ userId: user.id }, 'secret')
    };
  },
  async createUser(parent, args, { prisma }, info) {
    if (args.data.password.length < 8) {
      throw new Error('Password must be 8 characters or longer');
    }

    const password = await bcrypt.hash(args.data.password, 10);

    const user = prisma.mutation.createUser(
      { data: { ...args.data, password } }
    );

    return {
      user,
      token: jwt.sign({ userId: user.id }, 'secret')
    };
  },
  async deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.mutation.deleteUser({ where: { id: userId } }, info);
  },
  async updateUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.mutation.updateUser(
      {
        where: {
          id: userId
        },
        data: args.data
      },
      info
    );
  },
  createSession(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.mutation.createSession(
      {
        data: {
          date: args.data.date,
          user: {
            connect: {
              id: userId
            }
          }
        }
      },
      info
    );
  },
  async deleteSession(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const sessionExists = await prisma.exists.Session({
      id: args.id,
      user: {
        id: userId
      }
    });

    if (!sessionExists) {
      throw new Error('Unable to delete session');
    }

    return prisma.mutation.deleteSession({ where: { id: args.id } }, info);
  },
  async updateSession(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const sessionExists = await prisma.exists.Session({
      id: args.id,
      user: {
        id: userId
      }
    });

    if (!sessionExists) {
      throw new Error('Unable to update session');
    }


    return prisma.mutation.updateSession(
      {
        where: {
          id: args.id
        },
        data: args.data
      },
      info
    );
  },
  createExercise(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.mutation.createExercise(
      {
        data: {
          name: args.data.name,
          user: { connect: { id: userId } },
          session: { connect: { id: args.data.session } }
        }
      },
      info
    );
  },
  async deleteExercise(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const exerciseExists = await prisma.exists.Exercise({
      id: args.id,
      user: {
        id: userId
      }
    });

    if (!exerciseExists) {
      throw new Error('Unable to delete exercise');
    }

    return prisma.mutation.deleteExercise(
      {
        where: {
          id: args.id
        }
      },
      info
    );
  },
  async updateExercise(parent, args, { prisma, req }, info) {
    const userId = getUserId(req);

    const exerciseExists = await prisma.exists.Exercise({
      id: args.id,
      user: {
        id: userId
      }
    });

    if (!exerciseExists) {
      throw new Error('Unable to update exercise');
    }

    return prisma.mutation.updateExercise(
      {
        where: {
          id: args.id
        },
        data: args.data
      },
      info
    );
  }
};

export default Mutation;
