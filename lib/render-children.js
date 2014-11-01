module.exports = function (elements, children) {
  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    if (typeof child !== 'undefined') {
      if (child.element && typeof child.index === 'number') {
        var elem = child.element;
        elements.splice(child.index, 0, elem.render(elem));
      } else {
        elements.push(child && child.render && child.render(child) || child);
      }
    }
  };
  return elements;
}