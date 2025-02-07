const checkAcess = (role) => {
  return (req, res, next) => {
    if (role !== req.user.role) {
      res.status(403).json({ error: "Acess Denied" });
    }
    next();
  };
};
module.exports = checkAcess;
