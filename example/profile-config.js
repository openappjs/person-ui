
module.exports = {
    id: {renderAs: null},
    handle: {renderAs: 'input', type: 'text'},
    name: {renderAs: 'input', type: 'text' },
    email: {
      renderAs: 'input', 
      type: 'email', children: [],
      className: ['fa', 'fa-send']
    },
    bio: {renderAs: 'p'},
    image: {renderAs: 'img'},
    location: {
      renderAs: 'a', 
      editable: {renderAs:'input', type: 'text'}, 
      children:[],
      className: ['fa', 'fa-map-marker']
  }
};