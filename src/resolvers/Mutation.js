import bcrypt from 'bcryptjs';
import getUserId from '../utils/getUserId';
import generateToken from '../utils/generateToken';
import hashPassword from '../utils/hashPassword';

const TIME_DISTANCE_TYPES = ['TREADMILL', 'SPINNING_BIKE'];

const REP_WEIGHT_TYPES = [
  'LEG_PRESS_RIGHT_LEG',
  'LEG_PRESS_LEFT_LEG',
  'LEG_PRESS_BOTH_LEGS',
  'HAMSTRING_CURL_RIGHT_LEG',
  'HAMSTRING_CURL_LEFT_LEG',
  'HAMSTRING_CURL_BOTH_LEGS',
  'SQUAT',
  'DEADLIFT'
];

const Mutation = {
  async login(parent, args, { prisma }, info) {
    const user = await prisma.query.user({
      where: {
        email: args.data.email
      }
    });

    if (!user) {
      throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(args.data.password, user.password);

    if (!isMatch) {
      throw new Error('Unable to login');
    }

    return {
      user,
      token: generateToken(user.id)
    };
  },

  async createUser(parent, args, { prisma }, info) {
    const userExists = await prisma.exists.User({
      email: args.data.email
    });

    if (userExists) {
      throw new Error('Unable to create User, email taken');
    }

    const password = await hashPassword(args.data.password);
    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password
      }
    });

    return {
      user,
      token: generateToken(user.id)
    };
  },
  async deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.mutation.deleteUser({ where: { id: userId } }, info);
  },
  async updateUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    if (typeof args.data.password === 'string') {
      args.data.password = await hashPassword(args.data.password);
    }

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
  },
  async createSet(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const exercise = await prisma.query.exercise(
      { where: { id: args.data.exercise } },
      '{ id name session { id }}'
    );

    const opArgs = {
      user: { connect: { id: userId } },
      exercise: { connect: { id: exercise.id } },
      session: { connect: { id: exercise.session.id } }
    };

    // TODO add this logic to update
    if (
      TIME_DISTANCE_TYPES.includes(exercise.name) ||
      REP_WEIGHT_TYPES.includes(exercise.name)
    ) {
      if (TIME_DISTANCE_TYPES.includes(exercise.name)) {
        if (args.data.time && args.data.distance) {
          opArgs.time = args.data.time;
          opArgs.distance = args.data.distance;
        } else {
          throw new Error(
            `when adding set for ${exercise.name} you must add distance and time`
          );
        }
      }

      if (REP_WEIGHT_TYPES.includes(exercise.name)) {
        if (args.data.reps && args.data.weight) {
          opArgs.reps = args.data.reps;
          opArgs.weight = args.data.weight;
        } else {
          throw new Error(
            `when adding set for ${exercise.name} you must add reps and weight`
          );
        }
      }

      return prisma.mutation.createSet({ data: opArgs }, info);
    } else {
      throw new Error('Exercise name not included');
    }
  },
  async deleteSet(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const setExists = await prisma.exists.Set({
      id: args.id,
      user: {
        id: userId
      }
    });

    if (!setExists) {
      throw new Error('Unable to delete set');
    }

    return prisma.mutation.deleteSet(
      {
        where: {
          id: args.id
        }
      },
      info
    );
  },
  async updateSet(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    // TODO validation

    const setExists = await prisma.exists.Set({
      id: args.id,
      user: {
        id: userId
      }
    });

    if (!setExists) {
      throw new Error('Unable to update Set');
    }

    return prisma.mutation.updateSet(
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
