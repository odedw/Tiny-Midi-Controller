const config = require('./circuit.json');
const midiSender = require('./midiSender.js');
const mouse = require('osx-mouse')();
const robot = require('robotjs');
const screenSize = robot.getScreenSize();
const lastValues = {
  y: new Array(config.y.length)
};

function onMouseMove(x, y) {
  const yRatio = (screenSize.height - y) / screenSize.height;

  for (let i = 0; i < config.y.length; i++) {
    const parameter = config.y[i];
    const value = Math.round(
      (parameter.to - parameter.from) * yRatio + parameter.from
    );
    if (lastValues[i] != value) {
      lastValues[i] = value;
      midiSender.send(value, parameter);
    }
  }
}

midiSender
  .init(config.device)
  .then(() => {
    console.log('Ready...');

    const initialPos = robot.getMousePos();
    onMouseMove(initialPos.x, initialPos.y);
    mouse.on('move', onMouseMove);
  })
  .catch(err => {
    console.log(err);
    process.exit(1);
  });
