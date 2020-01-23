import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466',
  secret: 'supersecret'
});

export { prisma as default };

// prisma.query.users(null, '{id name email posts { id title } }').then(data => {
//   console.log(JSON.stringify(data, undefined, 2))
// })

// prisma.query.comments(null, '{id text author { id name }}').then(data => {
//   console.log(JSON.stringify(data, undefined, 2))
// });

// prisma.mutation
//   .createPost(
//     {
//       data: {
//         title: 'New graphql post',
//         body: '',
//         published: true,
//         author: {
//           connect: {
//             id: 'ck557d6kz001m0841k56v9of9'
//           }
//         }
//       }
//     },
//     '{ id title body published}'
//   )
//   .then(data => {
//     console.log(JSON.stringify(data, undefined, 2));

//     return prisma.query.users(null, '{id name posts { id title }}');
//   })
//   .then(data => {
//     console.log(JSON.stringify(data, undefined, 2));
//   });

// prisma.mutation
//   .updatePost(
//     {
//       data: {
//         body: 'updated body',
//         published: true,
//         // post: { connect: { id: 'ck559la2900gm0841nnyqmk9u' } }
//       },
//       where: { id: 'ck559la2900gm0841nnyqmk9u'}
//     },
//     '{ id title body published}'
//   )
//   .then(data => {
//     console.log(JSON.stringify(data, undefined, 2));
//     return prisma.query.posts(null, '{id body published}');
//   })
//   .then(data => {
//     console.log(JSON.stringify(data, undefined, 2));
//   });

// const createPostForUser = async (authorId, data) => {
//   const userExists = await prisma.exists.User({ id: authorId })

//   if (!userExists) {
//     throw new Error('User not found');
//   }

//   const post = await prisma.mutation.createPost({
//     data: {
//       ...data,
//       author: {
//         connect: {
//           id: authorId
//         }
//       }
//     }
//   }, '{ author { id name email posts { id title published} } }')

//   return post.author;
// }

// createPostForUser("ck556omqi00c90890vd0qd2ye", {
//   title: 'Great books to read',
//   body: 'The war of art',
//   published: true
// }).then( user => {

//   console.log(JSON.stringify(user, undefined, 2))
// }).catch(err => {
//   console.log(err)
// })

// const updatePostForUser = async (postId, data) => {
//   const postExists = await prisma.exists.Post({ id: postId })

//   if (!postExists) {
//     throw new Error('Post not found');
//   }

//   const updatedPost = await prisma.mutation.updatePost({
//     where: {
//       id: postId
//     },
//     data
//   }, '{ author { id name email posts { id title published }} }');

//   return updatedPost.author;
// }

// updatePostForUser("ck5f50o3m00080941wo329tjv", {
//   title: 'Great books to read sometimes',
// }).then( user => {

//   console.log(JSON.stringify(user, undefined, 2))
// }).catch(err => {
//   console.log(err)
// })  