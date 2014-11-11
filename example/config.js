var css = require('atomify-css');

var config = {
  entry: './node_modules/font-awesome/css/font-awesome.css',
  output: 'example/bundle.css',
  assets: {
    dest: 'example/assets/',
    prefix: 'example/assets/'
  }
}

css(config);