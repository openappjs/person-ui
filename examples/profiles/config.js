var css = require('atomify-css');

var config = {
  entry: './node_modules/font-awesome/css/font-awesome.css',
  output: 'example/profiles/bundle.css',
  assets: {
    dest: 'example/profiles/assets/',
    prefix: 'example/profiles/assets/'
  }
}

css(config);