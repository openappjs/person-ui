module.exports = function (options) {
  var width = options.width,
      height = options.height,
      view = options.view;

  var styleObj = {
    listItemMobile: require('./listItemMobile'),
    profileDesktop: require('./profileDesktop')
  };

  //element query logic
  if (width < 2000 && height < 1000 && view === 'list-item') {
    return styleObj.listItemMobile;
  } else {
    return styleObj.profileDesktop;
  }

}