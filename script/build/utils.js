const path = require('path');
const fs = require('fs');

const ENV = process.env.NODE_ENV;

// __dirname 当前文件路径
exports.resolve = function(dir){
  return path.join(__dirname, '../..', dir)
}

exports.readDir = function(dir){
	return fs.readdirSync(dir).reduce((prev, fileName) => {
    let next = prev;
		if(fileName[0] === '_') return next;

		let name = fileName.slice(0, fileName.indexOf('.'));
	  next[name] = `${dir}/${name}`;
	  return next;
	}, {});
}
