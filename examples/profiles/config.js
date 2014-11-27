var css = require('atomify-css');

var config = {
  entry: './node_modules/font-awesome/css/font-awesome.css',
  output: 'examples/profiles/bundle.css',
  assets: {
    dest: 'examples/profiles/assets/',
    prefix: 'examples/profiles/assets/'
  }
}

css(config);