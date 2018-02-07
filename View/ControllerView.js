const term = require('terminal-kit').terminal;
const NinePatchAsciiDrawer = require('./NinePatchAsciiDrawer');
const boxPatch = require('./box.json');
const fader = `\n  ┌──────────────┐
  │══════════════│
  └──────────────┘`;
const slot = `\n\n      ┌──────┐    
      │      │    
      │  ██  │    
      │  ██  │    
      │  ██  │    
      │  ██  │    
      │  ██  │    
      │  ██  │    
      │  ██  │    
      │  ██  │    
      │  ██  │    
      │  ██  │    
      │      │    
      └──────┘    `;
const lines = slot.split('\n').length - 2,
  margin = 2;

class ControllerView {
  constructor() {
    this.ninePatchDrawer = new NinePatchAsciiDrawer(
      str => term(str),
      (x, y) => term.moveTo(x, y)
    );
  }

  init() {
    term.clear();
    term.saveCursor();
    term.hideCursor();
    this.ninePatchDrawer.draw(
      boxPatch,
      margin + 1,
      margin + 1,
      term.width - margin * 2,
      term.height - margin * 2
    );

    // const boxWidth = term.width - margin * 2 - 2;
    // for (let i = margin; i < term.height - margin; i++) {
    //   term.moveTo(margin, i);
    //   const leftChar = i == margin ? '┌' : i < term.height - margin ? '│' : '└';
    //   const middleChar =
    //     i == margin ? '-' : i < term.height - margin ? ' ' : '-';
    //   const rightChar =
    //     i == term.height - margin - 1
    //       ? '┐'
    //       : i < term.height - margin ? '│' : '┘';

    //   term(`${leftChar}${middleChar.repeat(boxWidth)}${rightChar}`);
    // }
  }

  render(state) {
    // const param = state.y[0];
    // term.restoreCursor();
    // term(slot);
    // const ratio = (param.value - param.from) / (param.to - param.from);
    // let line = Math.round((lines - margin * 2 - 1) * ratio) + margin;
    // if (param.from < param.to) line = lines - (line + 1) + 1;
    // term.moveTo(1, line);
    // term(fader);
  }
}

module.exports = ControllerView;
