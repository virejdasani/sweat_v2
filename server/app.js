const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Import controllers
const moduleController = require('./src/controllers/moduleController');
const programmeController = require('./src/controllers/programmeController');
const calendarController = require('./src/controllers/calendarController');
const distributionController = require('./src/controllers/distributionController');

// Module routes
app.get('/modules/module-template', moduleController.getModuleTemplate);
app.get('/modules', moduleController.getAllModules);
app.get('/modules/ids', moduleController.getAllModuleIds);
app.get('/modules/:id', moduleController.getModuleById);
app.put(
  '/modules/update-programme-array',
  moduleController.updateProgrammeArrayInModules,
);
app.post(
  '/modules/create-module',
  moduleController.createOrUpdateModuleController,
);
app.put('/modules/:id', moduleController.createOrUpdateModuleController);
app.delete('/modules/:moduleCode', moduleController.deleteModuleById);

// Programme routes
app.get('/programmes', programmeController.getAllProgrammes);
app.get('/programmes/ids', programmeController.getAllProgrammeIds);
app.get('/programmes/:id', programmeController.getProgrammeById);
app.post('/programmes/create-programme', programmeController.createProgramme);
app.put('/programmes/:id', programmeController.updateProgrammeById);
app.put(
  '/programmes/:id/update-module-ids',
  programmeController.updateModuleIdsForAllProgrammes,
);
app.put(
  '/programmes/:id/remove-module',
  programmeController.removeModuleFromProgramme,
);
app.delete('/programmes/:id', programmeController.deleteProgrammeById);

// Calendar routes
app.get('/calendar', calendarController.getEvents);
app.post('/calendar/save-events', calendarController.saveEvents);
app.post('/calendar/add-event', calendarController.addEvent);
app.delete('/calendar/delete-event/:eventId', calendarController.deleteEvent);
app.put('/calendar/update-event/:eventId', calendarController.updateEvent);
app.delete('/calendar/delete-all-events', calendarController.deleteAllEvents);

// Distribution routes
app.post('/private-study-distributions', distributionController.getDistributions);

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log(err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});
