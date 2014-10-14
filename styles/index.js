module.exports = function (options) {
  var width = options.width,
      height = options.height,
      view = options.view;

  var styleObj = {
    listItemMobile: require('./listItemMobile')
  };

  //element query logic
  if (width < 2000 && height < 1000 && view === 'list-item') {
    return styleObj.listItemMobile;
  }
}