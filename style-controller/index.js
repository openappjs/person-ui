module.exports = function (parent, view) {
  var width = parent.width,
      height = parent.height;

  //element query logic
  if (view === 'list-item') return require('./list-item-desktop');
  if (view === 'graph') return require('./graph-desktop');
  return require('./profile-desktop')


}