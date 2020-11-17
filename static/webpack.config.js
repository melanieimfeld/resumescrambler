const path = require('path');

const config = {
 entry: __dirname + '/index.js',
 output:{
 	filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
},
 resolve: {
  extensions: ['.js','.jsx','.css']
 },
};

module.exports = config;