module.exports = function (parent, view) {
  var width = parent.width,
      height = parent.height;

  var styleObj = {
    listItemMobile: require('./list-item-desktop'),
    profileDesktop: require('./profile-desktop')
  };

  //element query logic
  if (view === 'list-item') {
    return styleObj.listItemMobile;
  } else {
    return styleObj.profileDesktop;
  }

}