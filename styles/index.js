module.exports = function (parentWidth, parentHeight) {
  var style = {
    listItemMobile: require('./listItemMobile')
  };

  //element query logic
  if (parentWidth < 2000 && parentHeight < 1000) return style.listItemMobile;


}