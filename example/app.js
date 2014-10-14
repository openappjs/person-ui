var mercury = require('mercury');
var Person = require('../');
var Aviator = require('aviator');
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

//data
var mikey = {
  model: {
    id: 1,
    name: "Mikey Williams",
    email: "dinosaur@example.com",
    bio: "a human from planet earth",
    image: 'data:image/png;base64,' + fs.readFileSync(__dirname + "/images/ahdinosaur.jpeg", "base64")
  },
  children: [icon],
  styles: require('../styles'),
  view: 'list-item'
}


var PeopleTarget = {
  render: function (req) {
    console.log('req', req)
    mikey.view = 'profile';

    var personProfile = Person(mikey)

    mercury.app(document.body, personProfile.state, Person.render);


  }
}

//define simple routing 
Aviator.setRoutes({
  '/people': {
    target: PeopleTarget,
      '/:id': {
        '/*': 'render'
      }
    }
});

Aviator.dispatch();

mikey['commands'] = {
    click: function () {
      Aviator.navigate('/people/mikey-williams')
    }
};


//bootstrap person component
var person = Person(mikey);



//render app on body, trigger re-render on state change
mercury.app(document.body, person.state, Person.render);

