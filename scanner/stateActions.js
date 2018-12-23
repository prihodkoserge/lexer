const constants = require("./constants");
const utils = require("./utils");

const setNext = nextState => state => ({ ...state, current: nextState });

const movePointer = input => state => {
  const normalizedPos = utils.getNormalizedPos(state, input);
  return { ...state, pos: state.pos + 1, normalizedPos };
};

const updateCurrentLexeme = input => state => ({
  ...state,
  currentLexeme: state.currentLexeme + input
});

const resetCurrentLexeme = () => state => ({ ...state, currentLexeme: "" });

const raiseError = error => state => ({
  ...state,
  errors: [...state.errors, error]
});

const addIdentifier = (lexeme, checkpoint) => state => {
  if (state.identifiers[lexeme]) {
    return {
      ...state,
      lexemes: [
        ...state.lexemes,
        utils.makeLexeme(state.identifiers[lexeme], checkpoint)
      ]
    };
  }

  if (state.keywords[lexeme]) {
    return {
      ...state,
      lexemes: [
        ...state.lexemes,
        utils.makeLexeme(state.keywords[lexeme], checkpoint)
      ]
    };
  }

  const code =
    constants.IDENTIFIERS_OFFSET + Object.keys(state.identifiers).length;
  return {
    ...state,
    lexemes: [...state.lexemes, utils.makeLexeme(code, checkpoint)],
    identifiers: {
      ...state.identifiers,
      [lexeme]: code
    }
  };
};

const addConstant = (lexeme, checkpoint) => state => {
  if (state.constants[lexeme]) {
    return {
      ...state,
      lexemes: [
        ...state.lexemes,
        utils.makeLexeme(state.constants[lexeme], checkpoint)
      ]
    };
  }

  const code = constants.CONSTANTS_OFFSET + Object.keys(state.constants).length;
  return {
    ...state,
    lexemes: [...state.lexemes, utils.makeLexeme(code, checkpoint)],
    constants: {
      ...state.constants,
      [lexeme]: code
    }
  };
};

const addMultiDelim = (lexeme, checkpoint) => state => {
  if (state.multiDelims[lexeme]) {
    return {
      ...state,
      lexemes: [
        ...state.lexemes,
        utils.makeLexeme(state.multiDelims[lexeme], checkpoint)
      ]
    };
  }

  const code =
    constants.MULTI_DELIMS_OFFSET + Object.keys(state.multiDelims).length;
  return {
    ...state,
    lexemes: [...state.lexemes, utils.makeLexeme(code, checkpoint)],
    multiDelims: {
      ...state.multiDelims,
      [lexeme]: code
    }
  };
};

const addSingleDelim = (lexeme, checkpoint) => state => ({
  ...state,
  lexemes: [
    ...state.lexemes,
    utils.makeLexeme(lexeme.charCodeAt(0), checkpoint)
  ]
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
