var mercury = require('mercury');
var source = require('geval/source');
var window = require('global/window');
var document = require('global/document');
 
var atom = Router.atom =
    mercury.value(String(document.location.pathname));
 
/*
  var mercury = require('mercury');
  var h = require('mercury').h;
  var anchor = require('mercury-route/anchor');
  var routeView = require('mercury-route/route-view');
  var Router = require('mercury-route/router');
 
  function State() {
    var state = mercury.struct({
      route: Router()
    });
    
    return { state: state }
  }
  
  mercury.app(document.body, State().state, render);
  
  function render(state) {
    return h('div', [
      menu(),
      routeView({
        '/': renderHome,
        '/animals': renderAnimals,
        '/animals/:id': renderAnimalItem
      }, { route: state.route })
    ])
  }
 
  function menu() {
    return h('ul', [
      h('li', [
        anchor({ 
          href: '/'
        }, 'Home')
      ]),
      h('li', [
        anchor({
          href: '/animals'
        }, 'Animals')
      ])
    ])
  }
 
*/
module.exports = Router;
 
function Router() {
    var inPopState = false;
    var popstates = popstate();
 
    popstates(onPopState);
    atom(onRouteSet);
 
    return { state: atom };
 
    function onPopState(uri) {
        inPopState = true;
        atom.set(uri);
    }
 
    function onRouteSet(uri) {
      console.log('onRouteSet', uri)
        if (inPopState) {
            inPopState = false;
            return;
        }
 
        pushHistoryState(uri);
    }
}
 
function pushHistoryState(uri) {
    window.history.pushState(undefined, document.title, uri);
}
 
function popstate() {
    return source(function broadcaster(broadcast) {
        window.addEventListener('popstate', onPopState);
 
        function onPopState() {
            console.log('onPopState')
            broadcast(String(document.location.pathname));
        }
    });
}