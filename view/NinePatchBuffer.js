class NinePatchBuffer {
  constructor(w, h) {
    this.x = 0;
    this.y = 0;
    this.buffer = [];
    for (let i = 0; i < h; i++) this.buffer.push(' '.repeat(w));
    this.draw = this.draw.bind(this);
    this.moveTo = this.moveTo.bind(this);
  }

  draw(str) {
    console.log(`draw '${str}' on at ${this.x},${this.y}`);
    // console.log(`'${this.buffer[0]}'`);

    this.buffer[this.y] =
      this.buffer[this.y].substr(0, this.x) +
      str +
      this.buffer[this.y].substr(this.x + str.length);
    this.x += str.length;
  }

  moveTo(x, y) {
    console.log(`Move to ${x},${y}`);

    this.x = x;
    this.y = y;
  }
}

module.exports = NinePatchBuffer;
