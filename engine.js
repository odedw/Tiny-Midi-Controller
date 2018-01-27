const midiSender = require('./midiSender.js');
const screenSize = require('robotjs').getScreenSize();
const config = require('./circuit.json');
const lastValues = {
  y: new Array(config.y.length),
  x: new Array(config.x.length)
};

function calcValueAndSendCommands(ratio, parameters, lastValues) {
  for (let i = 0; i < parameters.length; i++) {
    const parameter = parameters[i];
    const value = Math.round(
      (parameter.to - parameter.from) * ratio + parameter.from
    );
    if (lastValues[i] != value) {
      lastValues[i] = value;
      midiSender.send(value, parameter);
    }
  }
}
module.exports.onMouseMove = (x, y) => {
  // y parameters
  calcValueAndSendCommands(
    (screenSize.height - y) / screenSize.height,
    config.y,
    lastValues.y
  );

  // x parameters
  calcValueAndSendCommands(
    (screenSize.width - x) / screenSize.width,
    config.x,
    lastValues.x
  );
};
module.exports.onKeyDown = (x, y) => {};
