const fs = require('fs');
require('colors');
const dotenv = require('dotenv');
const Vehicle = require('../../models/vehicleModel');
const dbConnection = require('../../config/database');

dotenv.config({ path: '../../config.env' });

// connect to DB
dbConnection();

// Read data
const vehicles = JSON.parse(fs.readFileSync('./vehicle.json'));


// Insert data into DB
const insertData = async () => {
  try {
    await Product.create(vehicles);
    // await Vehicle.create(vehicles);

    console.log('Data Inserted'.green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Delete data from DB
const destroyData = async () => {
  try {
    await Vehicle.deleteMany();
    console.log('Data Destroyed'.red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// node seeder.js
if (process.argv[2] === '-i') {
  insertData();
} else if (process.argv[2] === '-d') {
  destroyData();
}
