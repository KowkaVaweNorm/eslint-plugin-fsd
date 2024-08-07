/**
 * @fileoverview FSD path checker
 * @author kowka_vn
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/fsd-path-checker"),
  RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: "module",
  },
});
ruleTester.run("fsd-path-checker", rule, {
  valid: [
    {
      filename:
        "C:\\Users\\KowkaVN\\domains\\work\\react-project\\src\\features\\Article",
      code: "import { getUserAuthData } from '../../Article/model/slices/command.ts';",
      errors: [],
    },
  ],

  invalid: [
    {
      filename:
        "C:\\Users\\KowkaVN\\domains\\work\\react-project\\src\\features\\Article",
      code: "import { getUserAuthData } from '@/features/Article/model/slices/command.ts';",
      errors: [
        {
          message: "В рамках одного модуля, импорты должны быть относительными",
        },
      ],
      options: [
        {
          alias: "@",
        },
      ],
    },
    {
      filename:
        "C:\\Users\\KowkaVN\\domains\\work\\react-project\\src\\features\\Article",
      code: "import { getUserAuthData } from 'features/Article/model/slices/command.ts';",
      errors: [
        {
          message: "В рамках одного модуля, импорты должны быть относительными",
        },
      ],
      
    },
  ],
});
