import getUserId from '../utils/getUserId';
// all endpoints require Auth

const Query = {
  me(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.query.user(
      {
        where: {
          id: userId,
          // need email?
        },
      },
      info
    );
  },
  sessions(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.query.sessions(
      {
        where: {
          user: {
            id: userId,
          },
        },
      },
      info
    );
  },
  exercises(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const opArgs = {
      where: {
        user: {
          id: userId,
        },
      },
    };

    if (args.sessionID) {
      opArgs.where = {
        session: {
          id: args.sessionID,
        },
      };
    }

    return prisma.query.exercises(opArgs, info);
  },
  async sets(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const opArgs = {
      where: {
        user: {
          id: userId,
        },
      },
    };

    if (args.exerciseID) {
      opArgs.where = {
        exercise: {
          id: args.exerciseID,
        },
      };
    }
    return prisma.query.sets(opArgs, info);
  },
};

export default Query;
