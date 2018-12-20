const fs = require("fs");
const reducer = require("./reducers");
const utils = require("./utils");

const fileContent = `
  PROGRAM testProgram;
  BEGIN
    FOR testVariable1 := 12
    ENDFOR
    (* comment *)
  END
`;

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
  lexemes: [],
  identifiers: {},
  constants: {},
  multiDelims: {},
  pos: 0,
  current: "input",
  currentLexeme: "",
  errors: [],
  keywords
};

const runScanner = content => {
  let state = initialState;
  while (state.pos < fileContent.length) {
    state = reducer(state, utils.makeInputAction(fileContent[state.pos]));
  }
  return state;
};

console.log(runScanner(fileContent));
