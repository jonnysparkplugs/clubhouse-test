const dotenv = require('dotenv');
const { LogLevels, logMessage } = require('./util/logging-util');
const clubhouse = require('./clubhouse/clubhouse');

logMessage(LogLevels.info, `Starting...`);

dotenv.load();
const clubhouseToken = process.env.CLUBHOUSE_TOKEN || null;

async function main() {
  clubhouse.init(clubhouseToken);
  const result = await clubhouse.requestDataFromClubhouse();
  logMessage(LogLevels.info, `Done...`);
}

main();
