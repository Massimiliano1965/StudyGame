var exec = require("cordova/exec");
var P = "StudyLock";
function call(action, args) {
  return function (ok, err) { exec(ok, err || function () {}, P, action, args || []); };
}
module.exports = {
  status: function (ok, err) { call("status")(ok, err); },
  setEnabled: function (on, ok, err) { call("setEnabled", [!!on])(ok, err); },
  unlock: function (minutes, ok, err) { call("unlock", [minutes | 0])(ok, err); },
  emergency: function (ok, err) { call("emergency")(ok, err); },
  lockNow: function (ok, err) { call("lockNow")(ok, err); },
  openOverlaySettings: function (ok, err) { call("openOverlaySettings")(ok, err); },
  openUsageSettings: function (ok, err) { call("openUsageSettings")(ok, err); }
};
