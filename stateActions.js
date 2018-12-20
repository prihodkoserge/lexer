const constants = require("./constants");

const setNext = nextState => state => ({ ...state, current: nextState });

const movePointer = () => state => ({ ...state, pos: state.pos + 1 });

const updateCurrentLexeme = input => state => ({
  ...state,
  currentLexeme: state.currentLexeme + input
});

const resetCurrentLexeme = () => state => ({ ...state, currentLexeme: "" });

const raiseError = error => state => ({
  ...state,
  errors: [...state.errors, error]
});

const addIdentifier = lexeme => state => {
  if (state.identifiers[lexeme]) {
    return {
      ...state,
      lexemes: [...state.lexemes, state.identifiers[lexeme]]
    };
  }

  if (state.keywords[lexeme]) {
    return {
      ...state,
      lexemes: [...state.lexemes, state.keywords[lexeme]]
    };
  }

  const code =
    constants.IDENTIFIERS_OFFSET + Object.keys(state.identifiers).length;
  return {
    ...state,
    lexemes: [...state.lexemes, code],
    identifiers: {
      ...state.identifiers,
      [lexeme]: code
    }
  };
};

const addConstant = lexeme => state => {
  if (state.constants[lexeme]) {
    return {
      ...state,
      lexemes: [...state.lexemes, state.constants[lexeme]]
    };
  }

  const code = constants.CONSTANTS_OFFSET + Object.keys(state.constants).length;
  return {
    ...state,
    lexemes: [...state.lexemes, code],
    constants: {
      ...state.constants,
      [lexeme]: code
    }
  };
};

const addMultiDelim = lexeme => state => {
  if (state.multiDelims[lexeme]) {
    return {
      ...state,
      lexemes: [...state.lexemes, state.multiDelims[lexeme]]
    };
  }

  const code =
    constants.MULTI_DELIMS_OFFSET + Object.keys(state.multiDelims).length;
  return {
    ...state,
    lexemes: [...state.lexemes, code],
    multiDelims: {
      ...state.multiDelims,
      [lexeme]: code
    }
  };
};

const addSingleDelim = lexeme => state => ({
  ...state,
  lexemes: [...state.lexemes, lexeme.charCodeAt(0)]
});

module.exports = {
  setNext,
  movePointer,
  updateCurrentLexeme,
  resetCurrentLexeme,
  raiseError,
  addIdentifier,
  addConstant,
  addMultiDelim,
  addSingleDelim
};
