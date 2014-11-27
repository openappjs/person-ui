var css = require('atomify-css');

var config = {
  entry: './node_modules/font-awesome/css/font-awesome.css',
  output: 'examples/graph/bundle.css',
  assets: {
    dest: 'examples/graph/assets/',
    prefix: 'examples/graph/assets/'
  }
}

css(config);