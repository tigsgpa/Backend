const mongoose = require('mongoose');

// Define the schema for bug reports
const bugReportSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  bugType: { type: String, required: true },
  description: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

// Create a model based on the schema
const BugReport = mongoose.model('BugReport', bugReportSchema);
module.exports = BugReport;
