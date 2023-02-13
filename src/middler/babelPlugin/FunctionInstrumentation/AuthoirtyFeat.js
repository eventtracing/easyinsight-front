const { declare } = require("@babel/helper-plugin-utils");

module.exports = declare(function (api) {
  api.assertVersion("^7.0.0");

  return {
    visitor: {
      Program() {
        // something
      },
    },
  };
});
