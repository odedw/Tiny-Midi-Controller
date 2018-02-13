const term = require('terminal-kit').terminal;
const NinePatchAsciiDrawer = require('./NinePatchAsciiDrawer');
const utils = require('../utils');
const boxPatch = require('./patches/box.json');
const faderHandlePatch = require('./patches/fader-handle.json');
const faderSlotPatch = require('./patches/fader-slot.json');
const NinePatchBuffer = require('./NinePatchBuffer');

const margin = 2;
const faderSlotWidth = 6;
const faderHandleHeight = 3;
const faderHeight = 12;
const faderWidth = 16;
const faderHandleMargin = 1;

class ControllerView {
  constructor() {
    this.ninePatchDrawer = new NinePatchAsciiDrawer(
      str => term(str),
      (x, y) => term.moveTo(x, y)
    );
    this.faderLocations = {};

    //buffer for slot recreation
    this.slotBuffer = new NinePatchBuffer(6, 15);
    new NinePatchAsciiDrawer(this.slotBuffer.draw, this.slotBuffer.moveTo).draw(
      faderSlotPatch,
      0,
      0,
      faderSlotWidth,
      faderHeight
    );
  }

  drawFaderSlot(x, y, w, h) {
    const slotHandleDiff = (w - faderSlotWidth) / 2;
    this.ninePatchDrawer.draw(
      faderSlotPatch,
      x + slotHandleDiff,
      y,
      faderSlotWidth,
      h
    );
  }

  drawFaderHandle(x, y, w, h, parameter) {
    //current handle location according to value
    let slotHandleDiff = (w - faderSlotWidth) / 2;
    let ratio = parameter.value / parameter.to;
    let handleY = Math.round(
      y +
        faderHandleMargin +
        (h - faderHandleMargin * 2 - faderHandleHeight) * ratio
    );

    for (let i = 0; i < h; i++) {
      if (i + y == handleY) {
        //draw current frame handle
        this.ninePatchDrawer.draw(
          faderHandlePatch,
          x,
          handleY,
          w,
          faderHandleHeight
        );
        i += faderHandleHeight - 1;
      } else {
        //erase previous frame's handle
        term.moveTo(x, i + y);
        term(
          ' '.repeat(slotHandleDiff) +
            this.slotBuffer.buffer[i] +
            ' '.repeat(slotHandleDiff)
        );
      }
    }
  }

  drawVerticalDivider(x, y, h) {
    for (let i = y; i < y + h; i++) {
      term.moveTo(x, i);
      term('│');
    }
  }

  drawHorizontalDivider(x, y, w) {
    term.moveTo(x, y);
    term('─'.repeat(w));
  }

  init(initialState) {
    term.clear();
    term.saveCursor();
    term.hideCursor();

    //container
    this.ninePatchDrawer.draw(
      boxPatch,
      margin,
      margin,
      term.width - margin * 2,
      term.height - margin * 2
    );

    //draw initial fader slots (handles will be drawn later)
    const allFaders = initialState.x.concat(initialState.y);
    let currentX = margin * 2 + 1,
      currentY = margin * 2 + 1;

    for (let i = 0; i < allFaders.length; i++) {
      const parameter = allFaders[i];
      this.drawFaderSlot(currentX, currentY, faderWidth, faderHeight);
      this.faderLocations[parameter.name] = { x: currentX, y: currentY };

      term.moveTo(currentX, currentY + faderHeight + 1);
      term(utils.fitToLength(parameter.name, faderWidth));

      if (i < allFaders.length - 1) {
        currentX += faderWidth + margin;
        this.drawVerticalDivider(currentX, currentY - margin, faderHeight + 3);
        currentX += margin + 1;
      }
    }
  }

  render(state) {
    //only draw handles
    const allFaders = state.x.concat(state.y);
    for (let i = 0; i < allFaders.length; i++) {
      const parameter = allFaders[i];
      const location = this.faderLocations[parameter.name],
        x = location.x,
        y = location.y,
        h = faderHeight,
        w = faderWidth;
      this.drawFaderHandle(
        location.x,
        location.y,
        faderWidth,
        faderHeight,
        parameter
      );
    }
  }
}

module.exports = ControllerView;
