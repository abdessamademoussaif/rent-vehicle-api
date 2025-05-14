 const Vehicle = require('../models/vehicleModel.js');
const asyncHandler = require('express-async-handler');

//@ when delete user, delete all his vehicles

const deletVehiclesUser = asyncHandler(async (req, res, next) => {
    await Vehicle.deleteMany({ owner: req.params.id });
    next();
    }
    
);
module.exports = deletVehiclesUser;