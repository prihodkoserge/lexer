const fs = require("fs");
const reducer = require("./reducers");
const utils = require("./utils");

const keywords = {
  PROGRAM: 401,
  BEGIN: 402,
  END: 403,
  LOOP: 404,
  ENDLOOP: 405,
  FOR: 406,
  ENDFOR: 407
};

const initialState = {
  done: false,
  lexemes: [],
  identifiers: {},
  constants: {},
  multiDelims: {},
  pos: 0,
  normalizedPos: {
    row: 1,
    column: 1
  },
  current: "input",
  currentLexeme: "",
  errors: [],
  keywords
};

const runScanner = content => {
  let state = initialState;
  while (!state.done) {
    state = reducer(state, utils.makeInputAction(content[state.pos]));
  }
  return state;
};

module.exports = runScanner;
