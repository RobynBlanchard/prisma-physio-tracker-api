import jwt from 'jsonwebtoken';

const getUserId = (req) => {
  const header = req.request.headers.authorization;

  if (!header) {
    throw new Error('Authentication required');
  }

  const token = header.replace('Bearer ', '');
  const decoded = jwt.verify(token, 'secret');

  return decoded.userId;
};

export { getUserId as default};