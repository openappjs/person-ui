var mercury = require('mercury');
var Person = require('../');
var fs = require('fs');

var insertCss = require('insert-css');
var cfs = require('css-face-string');

var Link = require('./child-components/link');
var Icon = require('./child-components/icon');


//insert styles and fonts
var fontAwesome = cfs.file({
  name: 'icons',
  files: [
    {url: 'node_modules/font-awesome/fonts/fontawesome-webfont.eot', format: 'eot'},
    {url: 'node_modules/font-awesome/fonts/fontawesome-webfont.svg', format: 'svg'},
    {url: 'node_modules/font-awesome/fonts/fontawesome-webfont.ttf', format: 'ttf'},
    {url: 'node_modules/font-awesome/fonts/fontawesome-webfont.woff', format: 'woff'},
  ]
});
insertCss(fontAwesome)
require('../index.css');

//bootstrap child components
var icon = Icon({
  model: {
    iconName: 'icon-arrow-right',
    screenReaderText: 'profile link',
    unicode: "\\f105",
    fontFamily: 'icons'
  },
  style: {
    lineHeight: '32px',
  }
}).state;

var link = Link({
  model: {
    href: '/mikey-williams'
  },
  children: [icon],
  style: {
      position: 'absolute',
      textDecoration: 'none',
      fontSize: '32px',
      fontWeight: 'bold',
      top: '-14px',
      right: '0px',
      color: '#777777'
  }
}).state;

//bootstrap person component
var person = Person({
  model: {
    name: "Mikey Williams",
    email: "dinosaur@example.com",
    bio: "a human from planet earth",
    image: 'data:image/png;base64,' + fs.readFileSync(__dirname + "/images/ahdinosaur.jpeg", "base64"),
  },
  children: {
    commands: [link]
  }
});



//render app on body, trigger re-render on state change
mercury.app(document.body, person.state, Person.render);

