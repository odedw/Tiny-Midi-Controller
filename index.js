#!/usr/bin/env node
'use strict';
const mouse = require('osx-mouse')();
const robot = require('robotjs');
const Engine = require('./Engine');
const MidiSender = require('./MidiSender'),
  midiSender = new MidiSender();
const readline = require('readline');
const program = require('commander');
const ConfigParser = require('./ConfigParser'),
  configParser = new ConfigParser();
const term = require('terminal-kit').terminal;

program.on('--help', () => {
  console.log('');
  console.log('Parameters:');
  console.log('');
  console.log(
    '    cc <channel> <controller> <from> <to>    Send control change on channel (1-16) to controller (0-119) in the range <from>-<to> (0-127)'
  );
});

program
  .option('-d <name>', 'Set device')
  .option('-x <parameters>', 'Parameters to be controlled by mouse x axis')
  .option('-y <parameters>', 'Parameters to be controlled by mouse y axis')
  .parse(process.argv);

let config = {};
try {
  config = configParser.parse(program);
} catch (error) {
  console.log(error);
  process.exit(1);
}
// console.log(config);
// process.exit(0);
midiSender
  .init(config.device)
  .then(() => {
    let engine = new Engine(config, midiSender);
    const initialPos = robot.getMousePos();
    engine.onMouseMove(initialPos.x, initialPos.y);
    mouse.on('move', engine.onMouseMove);
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.on('keypress', (str, key) => {
      if (key.ctrl && key.name === 'c') {
        term.reset();
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
