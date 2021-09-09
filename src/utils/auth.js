import jwt from 'jsonwebtoken';

export const signToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );
};

export const isAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization) {
    const tooken = authorization.slice(7, authorization.length);
    jwt.verify(tooken, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Token is not Valid' });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'Token Is not supplied' });
  }
};
