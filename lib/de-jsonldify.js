module.exports = function (obj) {
  if (obj['@id']) {
    obj.id = obj['@id'];
    delete obj['@id'];
    return obj;
  } else {
    return obj;
  }
}