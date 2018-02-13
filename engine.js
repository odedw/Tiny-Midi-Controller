const screenSize = require('robotjs').getScreenSize();
const ControllerView = require('./view/ControllerView');
class Engine {
  constructor(initialState, midiSender) {
    this.state = initialState;
    this.midiSender = midiSender;
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.view = new ControllerView();
    this.view.init(initialState);
  }

  calcValueAndSendCommands(ratio, parameters) {
    for (let i = 0; i < parameters.length; i++) {
      const parameter = parameters[i];
      const value = Math.round(
        (parameter.to - parameter.from) * ratio + parameter.from
      );
      if (parameter.value !== value) {
        parameter.value = value;
        // this.midiSender.send(parameter);
      }
    }
  }

  onMouseMove(x, y) {
    // y parameters
    this.calcValueAndSendCommands(
      (screenSize.height - y) / screenSize.height,
      this.state.y
    );

    // x parameters
    this.calcValueAndSendCommands(x / screenSize.width, this.state.x);

    this.view.render(this.state);
  }

  onKeyDown(key) {
    if (this.state.keys[key.name]) {
      this.state.keys[key.name].forEach(parameter => {
        // this.midiSender.send(parameter);
      });
    }
  }
}

module.exports = Engine;
