let config = {};
function assertAllIntPropsInRange(min, max, obj) {
  Object.keys(obj).forEach(key => {
    let num = parseInt(obj[key]);
    if (!isNaN(num) && (num < min || num > max))
      throw new Error(
        `The property '${key}' with value ${
          obj[key]
        } is out of the range ${min}-${max}`
      );
  });
}
const parseFuncs = {
  cc: (args, i) => {
    let param = {
      from: 0,
      to: 127,
      type: 'cc'
    };
    param.channel = parseInt(args[i++]);
    param.controller = parseInt(args[i++]);
    if (!isNaN(parseInt(args[i]))) {
      param.from = parseInt(args[i++]);
      param.to = parseInt(args[i++]);
    }
    assertAllIntPropsInRange(0, 127, param);
    return { i, param };
  }
};

function extractParams(args, flag) {
  let params = [];
  let index = args.indexOf(flag) + 1;
  while (index < args.length && !args[index].startsWith('-')) {
    let type = args[index++];
    if (!parseFuncs[type]) {
      throw new Error(`No parameter type by the name ${type}`);
    }
    let { param, i } = parseFuncs[type](args, index);
    index = i;
    params.push(param);
  }
  return params;
}

module.exports.parse = program => {
  if (!program.D) {
    console.log('No device specified');
    program.help();
  } else {
    config.device = program.D;
  }

  if (!program.Y && !program.X) {
    console.log('No parameters entered for either mouse or keys');
    program.help();
  }

  if (program.X) {
    config.x = extractParams(program.rawArgs, '-x');
  }

  if (program.Y) {
    config.y = extractParams(program.rawArgs, '-y');
  }
  return config;
};
module.exports.getConfig = () => config;
