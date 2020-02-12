import getUserId from '../utils/getUserId';

const User = {
  email: {
    fragment: 'fragment userId on User { id }',
    resolve(parent, args, {prisma, request}, info) {
      const userId = getUserId(request, false);
  
      if (userId && userId === parent.id) {
        return parent.email
      } else {
        return null
      }
    }
  },
  // sessions: {
  //   fragment: 'fragment userId on User { id }',
  //   resolve(parent, args, {prisma, request}, info) {
  //     return prisma.query.sessions({
  //       where: {
  //         user: {
  //           id: parent.id
  //         }
  //       }
  //     })
  //   }
  // },
  // exercises: {
  //   fragment: 'fragment userId on User { id }',
  //   resolve(parent, args, {prisma, request}, info) {
  //     return prisma.query.exercises({
  //       where: {
  //         user: {
  //           id: parent.id
  //         }
  //       }
  //     })
  //   }
  // }
};

export default User;
