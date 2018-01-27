const config = require('./circuit.json');
const mouse = require('osx-mouse')();
const robot = require('robotjs');
const engine = require('./engine');
const midiSender = require('./midiSender.js');
const readline = require('readline');

midiSender
  .init(config.device)
  .then(() => {
    console.log('Ready...');
    const initialPos = robot.getMousePos();
    engine.onMouseMove(initialPos.x, initialPos.y);
    mouse.on('move', engine.onMouseMove);
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.on('keypress', (str, key) => {
      if (key.ctrl && key.name === 'c') {
        process.exit();
      } else {
        engine.onKeyDown(key);
      }
    });
  })
  .catch(err => {
    console.log(err);
    process.exit(1);
  });
