const midiMessageTypes = require('./midiMessageTypes.json');

class ConfigParser {
  constructor() {
    this.config = { keys: {} };
  }

  // Extract all midi parameters for an input
  extractParams(args, flag) {
    let parameters = [];
    let index = args.indexOf(flag) + 1;
    while (index < args.length && !args[index].startsWith('-')) {
      let type = args[index++];
      if (!midiMessageTypes[type])
        throw new Error(`No parameter type or device parameter by the name '${type}'`);

      const format = midiMessageTypes[type].format;
      let parameter = { type };
      for (let i = 0; i < format.length; i++) {
        let val = parseInt(args[index]);
        // console.log(`parsing ${format[i]}, val: ${val}`);

        if (!isNaN(val)) {
          if (
            val < midiMessageTypes[type][format[i]].min ||
            val > midiMessageTypes[type][format[i]].max
          )
            throw new Error(
              `The parameter '${
                format[i]
              }' for MIDI message type '${type}' has to be in the range ${
                midiMessageTypes[type][format[i]].min
              }-${midiMessageTypes[type][format[i]].max}`
            );

          parameter[format[i]] = val;
          index++;
        } else {
          if (midiMessageTypes[type][format[i]].default === undefined)
            throw new Error(
              `No default value for the parameter '${format[i]}' for MIDI message type '${type}'`
            );

          parameter[format[i]] = midiMessageTypes[type][format[i]].default;
        }
      }
      parameter.name =
        type + ' ' + midiMessageTypes[type].displayName.map(p => parameter[p]).join(' ');
      parameters.push(parameter);
    }
    return parameters;
  }

  // Expand presets from the device module to the parameter
  expandDeviceModule(deviceModule, program) {
    Object.keys(deviceModule).forEach(key => {
      const keyIndex = program.rawArgs.indexOf(key);
      if (keyIndex < 0) return;

      const tokens = deviceModule[key].split(' ');
      program.rawArgs.splice(keyIndex, 1, ...tokens);
    });
  }

  // Set parameter name from device module if exists
  setParameterNamesFromDeviceModule(deviceModule) {
    const reverseModule = Object.keys(deviceModule).reduce((res, key) => {
      res[deviceModule[key]] = key;
      return res;
    }, {});
    this.config.x.concat(this.config.y).forEach(param => {
      if (reverseModule[param.name]) param.name = reverseModule[param.name];
    });
  }

  parse(program) {
    if (!program.D) {
      console.log('No device specified');
      program.help();
    }

    this.config.device = program.D;
    let deviceModule = {};
    try {
      deviceModule = require(`./devices/${this.config.device}.json`);
    } catch (err) {}

    this.expandDeviceModule(deviceModule, program);

    if (!program.Y && !program.X) {
      console.log('No parameters entered for either mouse or keys');
      program.help();
    }

    this.config.x = program.X ? this.extractParams(program.rawArgs, '-x') : [];
    this.config.y = program.Y ? this.extractParams(program.rawArgs, '-y') : [];

    this.setParameterNamesFromDeviceModule(deviceModule);
    return this.config;
  }
}

module.exports = ConfigParser;
