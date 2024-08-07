/* eslint-disable */
"use strict";
const path = require("path");

const  {isPathRelative} = require('../helpers')
module.exports = {
  meta: {
    type: null, 
    docs: {
      description: "FSD path checker",
      recommended: false,
      url: null, 
    },
    fixable: null, 
    schema: [
      {
        type: 'object',
        properties: {
          alias: {
            type: 'string'
          }
        }
      }
    ], 
  },

  create(context) {
    const alias = context.options[0]?.alias || '';
    return {
      ImportDeclaration(node) {
        const value = node.source.value
        const importTo = alias ? value.replace(`${alias}/`, '') : value;

        const fromFilename = context.getFilename();
        if (shouldBeRelative(fromFilename, importTo)) {
          context.report({
            node: node,
            message:
              "В рамках одного модуля, импорты должны быть относительными",
          });
        }
      },
    };
  },
};


const layers = {
  shared: "shared",
  entities: "entities",
  features: "features",
  widgets: "widgets",
  pages: "pages",
};

function shouldBeRelative(from, to) {
  if (isPathRelative(to)) {
    return false;
  }
  //example app/entities/Article
  const toArray = to.split("/");
  const toLayer = toArray[0];
  const toSlice = toArray[1];

  if (!toLayer || !toSlice || !layers[toLayer]) {
    return false;
  }

  const normalizedPath = path.toNamespacedPath(from);

  let projectFrom = normalizedPath;
  if (normalizedPath.includes("src")) {
    projectFrom = normalizedPath.split("src")[1];
  } else {
    return false;
  }

  const fromArray = projectFrom.split("\\");

  const fromLayer = fromArray[1];
  const fromSlice = fromArray[2];

  if (!fromLayer || !fromSlice || !layers[fromLayer]) {
    return false;
  }

  return fromSlice === toSlice && toLayer === fromLayer;

  //example C:\Users\KowkaVN\domains\work\react-project\src\entities\Article
}

// console.log(shouldBeRelative(`C:\\Users\\KowkaVN\\domains\\work\\react-project\\src\\features\\Article`, 'entities/Article/asdsd/adawdawd'));
