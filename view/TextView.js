const term = require('terminal-kit').terminal;

class TextView {
  constructor() {}

  init(initialState) {
    term.clear();
    term.saveCursor();
    term.hideCursor();
    const allParams = initialState.x.concat(initialState.y);
    this.maxParameterNameLength = Math.max(
      ...allParams.map(p => p.name.length)
    );

    this.render(initialState);
  }

  render(state) {
    term.moveTo(1, 1);

    state.x.concat(state.y).forEach(param => {
      term(
        param.name + ' '.repeat(this.maxParameterNameLength - param.name.length)
      );
      term('  -  ');
      term(this.padToLength(param.value ? param.value + '' : '', 3));
      term('\n');
    });
  }

  padToLength(str, length) {
    return ' '.repeat(length - str.length) + str;
  }
}

module.exports = TextView;
