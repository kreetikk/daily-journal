const fs = require("fs");
const path = require("path");

const save = journals => {
    fs.writeFile(
      path.join(__dirname, "..", "data", "dailyJournals.json"),
      JSON.stringify(journals, null, 2),
      error => {
        if (error) {
          throw error;
        }
      }
    );
  };

  module.exports = save;