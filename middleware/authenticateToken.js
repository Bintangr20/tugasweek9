const { verifyToken } = require('../utils/auth');

const authenticateToken = (req, res, next) => {
  const beareHeader = req.headers['authorization'];

  if (beareHeader) {
    const token = beareHeader.split(' ')[1];
    const data = verifyToken(token);

    if (data && data.id) {
      const userId = data.id;

      next();
    }else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = authenticateToken;

