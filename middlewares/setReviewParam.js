const mongoose = require('mongoose');

const setReviewParam = (req, res, next) => {
  const { user,vehicle } = req.query;
  const filter = {};

  if (user && mongoose.Types.ObjectId.isValid(user)) {
    filter.user = user;
  }

  if (vehicle && mongoose.Types.ObjectId.isValid(vehicle)) {
    filter.vehicle = vehicle;
  }
  
  req.filterObj = filter;
  next();
};

module.exports = setReviewParam;
