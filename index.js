#!/usr/bin/env node

const mouse = require('osx-mouse')();
const robot = require('robotjs');
const engine = require('./engine');
const midiSender = require('./midiSender');
const readline = require('readline');
const program = require('commander');
const configParser = require('./configParser');
program.on('--help', () => {
  console.log('');
  console.log('Parameters:');
  console.log('');
  console.log(
    '    cc <channel> <controller> <from> <to>    All values between 0-127'
  );
});

program
  .option('-d <name>', 'Set device')
  .option('-x <parameters>', 'Parameters to be controlled by mouse x axis')
  .option('-y <parameters>', 'Parameters to be controlled by mouse y axis')
  .parse(process.argv);

const config = configParser.parse(program);
// console.log(config);

midiSender
  .init(config.device)
  .then(() => {
    engine.init(config);
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
