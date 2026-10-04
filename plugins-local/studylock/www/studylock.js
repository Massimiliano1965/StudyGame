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
  setPin: function (hash, ok, err) { call("setPin", [String(hash || "")])(ok, err); },
  requestAdmin: function (ok, err) { call("requestAdmin")(ok, err); },
  releaseAdmin: function (ok, err) { call("releaseAdmin")(ok, err); },
  lockNow: function (ok, err) { call("lockNow")(ok, err); },
  openOverlaySettings: function (ok, err) { call("openOverlaySettings")(ok, err); },
  openUsageSettings: function (ok, err) { call("openUsageSettings")(ok, err); },
  openAppInfo: function (ok, err) { call("openAppInfo")(ok, err); }
};
