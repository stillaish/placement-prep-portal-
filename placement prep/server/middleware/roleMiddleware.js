const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).send({ error: 'Access denied. Admin only.' });
  }
};

module.exports = admin;
