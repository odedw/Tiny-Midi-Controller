const config = require('./circuit.json');
const mouse = require('osx-mouse')();
const robot = require('robotjs');
const engine = require('./engine');
const midiSender = require('./midiSender.js');

midiSender
  .init(config.device)
  .then(() => {
    console.log('Ready...');
    const initialPos = robot.getMousePos();
    engine.onMouseMove(initialPos.x, initialPos.y);
    mouse.on('move', engine.onMouseMove);
  })
  .catch(err => {
    console.log(err);
    process.exit(1);
  });
