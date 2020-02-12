import getUserId from '../utils/getUserId';

// all endpoints require Auth

const Query = {
  me(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.query.user({
      where: {
        id: userId
        // need email?
      }
    }, info);
  },
  sessions(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const sessions = prisma.query.sessions({
      where: {
        user: {
          id: userId
        }
      }
    }, info);

    return sessions;
  },
  exercises(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const opArgs = {
      where: {
        user: {
          id: userId
        }
      }
    };

    if (args.sessionID) {
      opArgs.where = {
        session: {
          id: args.sessionID
        }
      };
    }

    return prisma.query.exercises(opArgs, info);
  }
};

export default Query;
