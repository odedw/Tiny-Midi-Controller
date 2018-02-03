class ConfigParser {
  constructor() {
    this.config = {};
    this.parseFunctions = { cc: this.parseCC.bind(this) };
  }

  parseAndValidate(str, min, max, name) {
    const val = parseInt(str);
    if (val < min || val > max)
      throw new Error(
        `Parameter ${name} has value ${val} which is out of the accepted range of ${min}-${max}`
      );
    return val;
  }

  parseCC(args, i) {
    let param = {
      from: 0,
      to: 127,
      type: 'cc'
    };
    param.channel = this.parseAndValidate(args[i++], 1, 16, 'channel');
    param.controller = this.parseAndValidate(args[i++], 0, 119, 'controller');
    if (!isNaN(parseInt(args[i]))) {
      param.from = this.parseAndValidate(args[i++], 0, 127, 'from');
      param.to = this.parseAndValidate(args[i++], 0, 127, 'to');
    }
    return { i, param };
  }

  extractParams(args, flag) {
    let params = [];
    let index = args.indexOf(flag) + 1;
    while (index < args.length && !args[index].startsWith('-')) {
      let type = args[index++];
      if (!this.parseFunctions[type]) {
        throw new Error(`No parameter type by the name ${type}`);
      }
      let { param, i } = this.parseFunctions[type](args, index);
      index = i;
      params.push(param);
    }
    return params;
  }

  expandDeviceModule(deviceModule, program) {
    Object.keys(deviceModule).forEach(key => {
      const keyIndex = program.rawArgs.indexOf(key);
      if (keyIndex < 0) return;

      const tokens = deviceModule[key].split(' ');
      program.rawArgs.splice(keyIndex, 1, ...tokens);
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

    return this.config;
  }
}

module.exports = ConfigParser;
