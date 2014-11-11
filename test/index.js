var test = require('tape');
var mercury = require('mercury');
var raf = require('raf');
var fs = require('fs');
// var event = require('synthetic-dom-events');
var document = require('global/document');
var isArray = require('is-array');

var Person = require('../');

var listItemDesktop = require('../style-controller/list-item-desktop');

var mikey = {
  model: {
    id: 1,
    name: "Mikey Williams",
    handle: 'ahdinosaur',
    email: "dinosaur@example.com",
    bio: "a human from planet earth",
    image: "http://gravatar.com/avatar/22ee24b84d0a2a9446fc9c0fe0652c46?d=identicon",
    location: [
      { id: "http://sws.geonames.org/5332921/", name: 'California' },
      { id: "http://sws.geonames.org/2186224/", name: 'New Zealand' }
    ]
  },
  config: {
    id: {renderAs: null},
    name: {renderAs: 'input'},
    handle: {renderAs: null},
    email: {renderAs: null},
    bio: {renderAs: null},
    image: {renderAs: 'img'},
    location: {renderAs: null}
  },
  styleController: require('../style-controller'),
  view: 'list-item'
}


function testElementStyle (t, element, styleSpec) {
  for (prop in styleSpec) {
    t.equal(element.style[prop], styleSpec[prop])
  }
}

test("person creation", function (t) {
  // setup
  var person = Person(mikey);

  // start app
  mercury.app(document.body, person.state, Person.render);

  // after render
  raf(function () {
    var person = document.getElementsByClassName('person')[0];

    //test styles
    testElementStyle(t, person, listItemDesktop.person);

    var image = person.getElementsByClassName('image')[0];
    t.ok(image);
    testElementStyle(t, image, listItemDesktop.image);

    var name = person.getElementsByClassName('name')[0];
    t.ok(name);
    testElementStyle(t, name, listItemDesktop.name);

    // cleanup
    document.body.removeChild(person);
    t.end();
  });
});
