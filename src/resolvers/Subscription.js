const Subscription = {
  exercise: {
    subscribe(parent, { exerciseId }, { prisma }, info) {
      return prisma.subscription.exercise(null, info);
    }
  },
  session: {
    subscribe(parent, args, { prisma }, info) {
      return prisma.subscription.session(null, info);
    }
  }
};

export default Subscription;
