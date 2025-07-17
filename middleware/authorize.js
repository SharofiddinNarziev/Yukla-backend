module.exports = function authorize(requredRole) {
  return (req, res, next) => {
    if(!req.user || req.user.role !== requiredRole) {
      return res.status(403).json({ message: "Ruxsat yo‘q" });
    }
    next();
   };
};