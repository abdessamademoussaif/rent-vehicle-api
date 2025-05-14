const categoryRoute = require('./categoryRoute');
const markRoute = require('./markRoute');
const vehicleRoute = require('./vehicleRoute');
const userRoute = require('./userRoute');
const authRoute = require('./authRoute');
const reviewRoute = require('./reviewRoute');
const bookingRoute = require('./bookingRoute');
const googleAuthRoute = require('./googleAuthRoute');
const notificationRoute = require('./notificationRoute');

const mountRoutes = (app) => {
  app.use('/api/v1/categories', categoryRoute);
  app.use('/api/v1/marks', markRoute);
  app.use('/api/v1/vehicles', vehicleRoute);
  app.use('/api/v1/users', userRoute);
  app.use('/api/v1/auth', authRoute);
  app.use('/api/v1/reviews', reviewRoute);
  app.use('/api/v1/bookings', bookingRoute); 
  app.use('/api/v1/auth', googleAuthRoute);
  app.use('/api/v1/notifications',notificationRoute)
};

module.exports = mountRoutes;
  