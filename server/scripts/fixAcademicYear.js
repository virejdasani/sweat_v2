const mongoose = require('mongoose');
const Module = require('../src/models/module');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sweat';

async function fixAcademicYear() {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Connected to MongoDB');

  // Update moduleSetup.academicYear if missing
  const modules = await Module.find({});
  let updatedModules = 0;
  for (const mod of modules) {
    let changed = false;
    if (!mod.moduleSetup.academicYear) {
      mod.moduleSetup.academicYear = '2024/25';
      changed = true;
    }
    if (Array.isArray(mod.courseworkList)) {
      for (const cw of mod.courseworkList) {
        if (!cw.academicYear) {
          cw.academicYear = mod.moduleSetup.academicYear || '2024/25';
          changed = true;
        }
      }
    }
    if (changed) {
      await mod.save();
      updatedModules++;
    }
  }
  console.log(`Updated ${updatedModules} modules.`);
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
}

fixAcademicYear().catch((err) => {
  console.error('Error updating academicYear:', err);
  process.exit(1);
});
