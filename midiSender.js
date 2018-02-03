global.navigator = require('web-midi-api');
if (!global.performance)
  global.performance = { now: require('performance-now') };
const WebMidi = new require('webmidi');
class MidiSender {
  constructor() {
    let output = undefined;
    let lastValues = {};
  }

  init(device) {
    return new Promise((fulfill, reject) => {
      WebMidi.enable(err => {
        if (err) reject(err);
        this.output = WebMidi.getOutputByName(device);

        if (!this.output) {
          reject(
            `No output by the name ${device}.\nAvailable devices are:\n${WebMidi.outputs
              .map(output => `\t${output.name}`)
              .join('\n')}`
          );
        }
        fulfill();
      });
    });
  }

  send(parameter, value = parameter.value) {
    try {
      if (parameter.type == 'cc') {
        // console.log(
        //   `channel:${parameter.channel}, controller:${
        //     parameter.controller
        //   }, value:${value}`
        // );

        this.output.sendControlChange(
          parameter.controller,
          value,
          parameter.channel
        );
      }
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = MidiSender;
