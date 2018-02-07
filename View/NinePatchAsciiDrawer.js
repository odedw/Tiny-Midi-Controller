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

  drawRow(left, center, right, x, y, w, h) {
    const segmentHeight = left.length; //should be same for all segments
    const repeats = (w - left[0].length - right[0].length) / center[0].length;
    for (let i = 0; i < h; i++) {
      this.move(x, y + i);
      const row = i % segmentHeight;
      this.d(left[row]);
      this.d(center[row].repeat(repeats));
      this.d(right[row]);
    }
  }

  //currently each segment has to be 1x1
  draw(patch, x, y, width, height) {
    this.validate(patch);
    const topHeight = patch.topLeft.length;
    const bottomHeight = patch.bottomLeft.length;
    const centerHeight = height - topHeight - bottomHeight;
    // top
    this.drawRow(
      Array.isArray(patch.topLeft) ? patch.topLeft : [patch.topLeft],
      Array.isArray(patch.topCenter) ? patch.topCenter : [patch.topCenter],
      Array.isArray(patch.topRight) ? patch.topRight : [patch.topRight],
      x,
      y,
      width,
      topHeight
    );
    //center
    this.drawRow(
      Array.isArray(patch.centerLeft) ? patch.centerLeft : [patch.centerLeft],
      Array.isArray(patch.centerCenter)
        ? patch.centerCenter
        : [patch.centerCenter],
      Array.isArray(patch.centerRight)
        ? patch.centerRight
        : [patch.centerRight],
      x,
      y + topHeight,
      width,
      centerHeight
    );
    //bottom
    this.drawRow(
      Array.isArray(patch.bottomLeft) ? patch.bottomLeft : [patch.bottomLeft],
      Array.isArray(patch.bottomCenter)
        ? patch.bottomCenter
        : [patch.bottomCenter],
      Array.isArray(patch.bottomRight)
        ? patch.bottomRight
        : [patch.bottomRight],
      x,
      y + height - bottomHeight,
      width,
      bottomHeight
    );
  }
}

module.exports = NinePatchAsciiDrawer;
