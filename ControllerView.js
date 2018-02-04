const term = require('terminal-kit').terminal;
term.clear();
term.saveCursor();
term.hideCursor();
const fader = `┌──────────────┐
│══════════════│
└──────────────┘`;
const slot = `    ┌──────┐    
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
const lines = slot.split('\n').length,
  margin = 2;

module.exports = state => {
  // const param = state.y[0];
  // term.restoreCursor();
  // term(slot);
  // const ratio = (param.value - param.from) / (param.to - param.from);
  // let line = Math.round((lines - margin * 2 - 1) * ratio) + margin;
  // if (param.from < param.to) line = lines - (line + 1);
  // term.moveTo(1, line);
  // term(fader);
};
