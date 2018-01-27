global.navigator = require('web-midi-api');
if (!global.performance)
  global.performance = { now: require('performance-now') };
const WebMidi = new require('webmidi');
let output = undefined;
let lastValues = {};

function convertToValue(value, from, to) {
  return;
}
module.exports.init = device =>
  new Promise((fulfill, reject) => {
    WebMidi.enable(err => {
      if (err) reject(err);
      output = WebMidi.getOutputByName(device);
      if (!output) reject('No output by the name ' + device);
      fulfill();
    });
  });

module.exports.send = (value, parameter) => {
  try {
    if (parameter.type == 'cc') {
      output.sendControlChange(parameter.control, value, parameter.channel);
    }
  } catch (err) {
    console.log(err);
  }
};
