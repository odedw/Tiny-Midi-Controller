const screenSize = require('robotjs').getScreenSize();
class Engine {
  constructor(config, midiSender) {
    this.config = config;
    this.midiSender = midiSender;
    this.lastValues = {
      y: new Array(config.y.length),
      x: new Array(config.x.length)
    };
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  calcValueAndSendCommands(ratio, parameters, lastValues) {
    for (let i = 0; i < parameters.length; i++) {
      const parameter = parameters[i];
      const value = Math.round(
        (parameter.to - parameter.from) * ratio + parameter.from
      );
      if (this.lastValues[i] != value) {
        this.lastValues[i] = value;
        this.midiSender.send(parameter, value);
      }
    }
  }

  onMouseMove(x, y) {
    // y parameters
    this.calcValueAndSendCommands(
      (screenSize.height - y) / screenSize.height,
      this.config.y,
      this.lastValues.y
    );

    // x parameters
    this.calcValueAndSendCommands(
      (screenSize.width - x) / screenSize.width,
      this.config.x,
      this.lastValues.x
    );
  }

  onKeyDown(key) {
    if (this.config.keys[key.name]) {
      this.config.keys[key.name].forEach(parameter => {
        this.midiSender.send(parameter);
      });
    }
  }
}

module.exports = Engine;
