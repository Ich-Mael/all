const moment = require("moment");

module.exports.localTime = function (date = Date.now(), info = "") {
  return moment(date).locale("fr").format(`[${info}] dddd Do MMMM  YYYY`, "LL");
};

module.exports.engTime = function (date = Date.now(), info = "") {
  return moment(date).format(`[${info}] dddd, Do MMMM  YYYY`);
};

module.exports.revealTime = function (date) {
  return moment().isSameOrAfter(date);
};
