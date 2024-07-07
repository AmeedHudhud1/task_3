const { defineConfig } = require("cypress");

module.exports = defineConfig({
  "e2e": {
    "baseUrl": "https://petstore.octoperf.com",
    "specPattern": "**/*.cy.js"
  }
});



