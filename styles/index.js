module.exports = function (parent, view) {
  var width = parent.width,
      height = parent.height;

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