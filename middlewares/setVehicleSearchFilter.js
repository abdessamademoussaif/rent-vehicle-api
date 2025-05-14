const mongoose = require('mongoose');

const setVehicleSearchFilter = (req, res, next) => {
  const { mark, category, year, condition, minPrice, maxPrice } = req.query;
  const filter = {};

  if (mark && mongoose.Types.ObjectId.isValid(mark)) {
    filter.mark = mark;
  }

  if (category && mongoose.Types.ObjectId.isValid(category)) {
    filter.category = category;
  }

  if (year) {
    filter.year = year;
  }

  if (condition) {
    filter.condition = condition;
  }

  else if (minPrice && maxPrice) {
    filter.pricePerDay = { $gte: minPrice, $lte: maxPrice };
  }

  req.filterObj = filter;
  next();
};

module.exports = setVehicleSearchFilter;
