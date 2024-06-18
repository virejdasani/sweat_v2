const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, '..', 'templates');

exports.getModuleTemplate = (req, res) => {
  const { moduleCredit, semester } = req.query;

  const templateFileName = `module-template-${moduleCredit}-${semester}.json`;
  const templateFilePath = path.join(templatesDir, templateFileName);

  if (fs.existsSync(templateFilePath)) {
    const templateData = fs.readFileSync(templateFilePath, 'utf-8');
    res.json(JSON.parse(templateData));
  } else {
    res.status(404).json({ message: 'Module template not found' });
  }
};
