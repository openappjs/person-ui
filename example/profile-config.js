
module.exports = {
    id: {renderAs: null},
    handle: {renderAs: 'input', type: 'text'},
    name: {renderAs: 'input', type: 'text' },
    email: {renderAs: 'input', type: 'email', children: []},
    bio: {renderAs: 'p'},
    image: {renderAs: 'img'},
    location: {renderAs: 'a', editable: {renderAs:'input', type: 'text'}, children:[]}
};