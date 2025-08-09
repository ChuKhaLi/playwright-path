module.exports = {
  default: {
    requireModule: ["ts-node/register"],
    require: ["src/step-definitions/**/*.ts", "src/support/**/*.ts"],
    paths: ["features/**/*.feature"],
    format: [
      "json:reports/cucumber-report.json",
      "html:reports/cucumber-report.html",
      "summary"
    ],
    publishQuiet: true,
  },
};