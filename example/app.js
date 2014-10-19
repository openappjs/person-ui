var mercury = require('mercury');
var Person = require('../');
var Aviator = require('aviator');
var fs = require('fs');
var domready = require('domready');

var insertCss = require('insert-css');
var cfs = require('css-face-string');

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

//bootstrap child component
var icon = Icon({
  model: {
    iconName: 'icon-arrow-right',
    screenReaderText: 'profile link',
    unicode: "\\f105",
    fontFamily: 'icons'
  },
  style: {
    icon: {
      position: 'absolute',
      'font-size': '32px',
      'font-weight': 'bold',
      top: '-14px',
      right: '0px',
      color: '#777777'      
    }
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
  styleController: require('../styles'),
  view: 'list-item'
}


var ProfileTarget = {
  render: function (req) {
    mikey.view = 'profile';
    mikey.children = [null];
    var personProfile = Person(mikey)
    var elem = document.getElementById('_'+mikey.model.id);
    elem.remove();
    mercury.app(document.body, personProfile.state, Person.render);
    console.log('history', history.state)

  }
}

//define simple routing 
Aviator.pushStateEnabled = true;
Aviator.setRoutes({
  '/people': {
    target: ProfileTarget,
      '/:id': {
        '/*': 'render'
      }
    }
});

Aviator.dispatch();

//pass in commands
mikey['commands'] = {
    click: function (state) {
      console.log('state', state)
      Aviator.navigate('/people/mikey-williams')
    }
};



domready(function() {
  var elem = document.body;
  mikey.parent = {
    height: elem.clientHeight,
    width: elem.clientWidth
  };

  console.log('mikey', mikey)

  //bootstrap person component
  var person = Person(mikey);

  //render app on body, trigger re-render on state change
  mercury.app(elem, person.state, Person.render);

})


