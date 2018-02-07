class NinePatchAsciiDrawer {
  constructor(drawFunc, moveFunc) {
    this.d = drawFunc;
    this.move = moveFunc;
  }

  validate(patch) {
    //TODO
    // all segments in each row have same height
    // there's space for all
    // center segments fit in center sizes vert and horz
  }

  getHeight(str) {
    return str.split('\n').length;
  }

  drawRow(left, center, right, x, y, width) {
    this.move(x, y);
    this.d(left);
    const repeats = (width - left.length - right.length) / center.length;
    this.d(center.repeat(repeats));
    this.d(right);
  }

  //currently each segment has to be 1x1
  draw(patch, x, y, width, height) {
    this.validate(patch);
    // top
    this.drawRow(patch.topLeft, patch.topCenter, patch.topRight, x, y, width);

    //center
    for (let i = 0; i < height - 2; i++) {
      this.drawRow(
        patch.centerLeft,
        patch.centerCenter,
        patch.centerRight,
        x,
        y + 1 + i,
        width
      );
    }

    //bottom
    this.drawRow(
      patch.bottomLeft,
      patch.bottomCenter,
      patch.bottomRight,
      x,
      y + height - 1,
      width
    );
  }
}

module.exports = NinePatchAsciiDrawer;
