var mercury = require('mercury');

var Aviator = require('aviator');
var fs = require('fs');
var domready = require('domready');

//components
var Person = require('../');
var Icon = require('mercury-fa');

//require preprocessed styles
require('./bundle.css');
require('../index.css');

//bootstrap child component
var icon = Icon({
  model: {
    iconName: 'chevron-right',
    screenReaderText: 'profile link'
  },
  style: {
    icon: {
      position: 'absolute',
      'font-size': '24px',
      'font-weight': 'bold',
      top: '22px',
      right: '10px',
      color: '#777777'      
    }
  }
}).state;

//data
var mikey = {
  model: {
    id: 1,
    name: "Mikey Williams",
    handle: 'ahdinosaur',
    email: "dinosaur@example.com",
    bio: "a human from planet earth",
    image: "http://gravatar.com/avatar/22ee24b84d0a2a9446fc9c0fe0652c46?d=identicon",
    location: [
      { "@id": "http://sws.geonames.org/5332921/", name: 'California' },
      { "@id": "http://sws.geonames.org/2186224/", name: 'New Zealand' }
    ],
    memberships: [
      {
        "@id": "http://api.craftodex.enspiral.info/memberships/craftworks-mikey",
        "@type": "Membership",
        description: "mad scientist",
        group: { "@id": "http://api.craftodex.enspiral.info/groups/craftworks" },
        startDate: "2014-04-28",
        role: [
          { "@id": "http://api.craftodex.enspiral.info/roles/journeyer-developer" },
          { "@id": "http://api.craftodex.enspiral.info/roles/provisional-member" }
        ]
      }
    ],
  },
  config: {
    id: { renderAs: null, key: '@id' },
    name: { renderAs: 'input' },
    handle: { renderAs: null} ,
    email: { renderAs: null },
    bio: { renderAs: null },
    image: { renderAs: 'img' },
    location: { renderAs: null }
  },
  children: [icon],
  styleController: require('../style-controller'),
  view: 'list-item'
}


var ProfileTarget = {
  render: function (req) {
    mikey.config = require('./profile-config');
    mikey.view = 'profile';
    mikey.children.length  = 0;
    var personProfile = Person(mikey)
    var elem = document.getElementById('_'+mikey.model.id);
    elem.remove();
    mercury.app(document.body, personProfile.state, Person.render);

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
  //pass parent elem size attributes into child component for responsive styling purposes (unused)
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


