const midiSender = require('./midiSender.js');
const screenSize = require('robotjs').getScreenSize();
let lastValues, config;

function calcValueAndSendCommands(ratio, parameters, lastValues) {
  for (let i = 0; i < parameters.length; i++) {
    const parameter = parameters[i];
    const value = Math.round(
      (parameter.to - parameter.from) * ratio + parameter.from
    );
    if (lastValues[i] != value) {
      lastValues[i] = value;
      midiSender.send(parameter, value);
    }
  }
}
module.exports.init = c => {
  lastValues = {
    y: new Array(c.y.length),
    x: new Array(c.x.length)
  };
  config = c;
};
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
module.exports.onKeyDown = key => {
  if (config.keys[key.name]) {
    config.keys[key.name].forEach(parameter => {
      midiSender.send(parameter);
    });
  }
};
