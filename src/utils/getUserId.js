import jwt from 'jsonwebtoken';

const getUserId = (req) => {
  const header = req.request.headers.authorization;

  if (!header) {
    const error = new Error('Authentication required');

    throw error;
  }
  const token = header.replace('Bearer ', '');
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  return decoded.userId;
};

export { getUserId as default };
