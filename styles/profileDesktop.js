var mercury = require('mercury');
var Tag = require('meta-tags');

var tag = Tag({
  model: {
    Name: 'viewport',
    content: 'width=device-width, initial-scale=1'
  }
});

mercury.app(document.head, tag.state, Tag.render)

module.exports = {
  type: "Person-UI",
  className: "person",
  properties: {
  },
  children: [
    {
      type: "childElement",
      className: "image",
      properties: {

      }
    },
    {
      type: "childElement",
      className: "properties",
      properties: {

      },
      children: [
        {
          type: "childElement",
          className: "property",
          properties: {

          },
          children: [
            {
              type: "childElement",
              className: 'label',
              properties: {
                'display': 'none'
              }
            },
            {
              type: "childElement",
              className: 'input',
              properties: {
                'border': 'none'
              }
            },

          ]
        }
      ]
    },
    {
      type: "childElement",
      className: "children",
      properties: {
      },
      children: [
        {
          type: "childElement",
          className: "child",
          properties: {
          },
          children: [
          {
            type: 'childElement',
            className: "iconDiv",
            properties: {
            }
          }
          ]
        }
      ]
    }
  ]
}