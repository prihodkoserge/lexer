const actions = require("./stateActions");

const compose = (...fns) => x => fns.reduceRight((y, f) => f(y), x);

const numberStateReducer = (state, action) => {
  if (action.symbolClass === "digit") {
    return compose(
      actions.setNext("number"),
      actions.updateCurrentLexeme(action.input),
      actions.movePointer()
    )(state);
  }

  return compose(
    actions.setNext("input"),
    actions.addConstant(state.currentLexeme),
    actions.resetCurrentLexeme()
  )(state);
};

const idnStateReducer = (state, action) => {
  if (["letter", "digit"].includes(action.symbolClass)) {
    return compose(
      actions.setNext("idn"),
      actions.updateCurrentLexeme(action.input),
      actions.movePointer()
    )(state);
  }

  return compose(
    actions.setNext("input"),
    actions.addIdentifier(state.currentLexeme),
    actions.resetCurrentLexeme()
  )(state);
};

const spaceStateReducer = (state, action) =>
  compose(
    actions.setNext("input"),
    actions.movePointer()
  )(state);

const singleDelimStateReducer = (state, action) =>
  compose(
    actions.setNext("input"),
    actions.movePointer(),
    actions.addSingleDelim(action.input)
  )(state);

const commentEnterStateReducer = (state, action) =>
  compose(
    actions.setNext("commentBegin"),
    actions.movePointer()
  )(state);

const commentBeginStateReducer = (state, action) => {
  if (action.input === "*") {
    return compose(
      actions.setNext("commentBody"),
      actions.movePointer()
    )(state);
  }

  return compose(
    actions.raiseError(error),
    actions.setNext("input"),
    actions.movePointer()
  )(state);
};

const commentBodyStateReducer = (state, action) => {
  const next = action.input === "*" ? "commentEnding" : state.current;
  return compose(
    actions.setNext(next),
    actions.movePointer()
  )(state);
};

const commentEndingStateReducer = (state, action) => {
  const next =
    action.input === "*"
      ? state.current
      : action.input === ")"
      ? "input"
      : "commentBody";

  return compose(
    actions.setNext(next),
    actions.movePointer()
  )(state);
};

const enterMultiDelim1StateReducer = (state, action) =>
  compose(
    actions.setNext("multiDelim1"),
    actions.movePointer(),
    actions.updateCurrentLexeme(action.input)
  )(state);

const multiDelim1StateReducer = (state, action) => {
  if (action.input === "=") {
    return compose(
      actions.setNext("input"),
      actions.addMultiDelim(state.currentLexeme + action.input),
      actions.resetCurrentLexeme(),
      actions.movePointer()
    )(state);
  }

  const error = `Unexpected token. Expected "=", but got "${action.input}" `;
  return compose(
    actions.raiseError(error),
    actions.movePointer(),
    actions.setNext("input")
  )(state);
};

const inputStateReducer = (state, action) => {
  switch (action.symbolClass) {
    case "letter":
      return idnStateReducer(state, action);
    case "digit":
      return numberStateReducer(state, action);
    case "space":
      return spaceStateReducer(state, action);
    case "singleDelim":
      return singleDelimStateReducer(state, action);
    case "commentEnter":
      return commentEnterStateReducer(state, action);
    case "multiDelim1":
      return enterMultiDelim1StateReducer(state, action);
    default:
      return {
        ...state,
        errors: [...state.errors, "Char is not recognized"]
      };
  }
};

const mainStateReducer = (state, action) => {
  switch (state.current) {
    case "input":
      return inputStateReducer(state, action);
    case "number":
      return numberStateReducer(state, action);
    case "idn":
      return idnStateReducer(state, action);
    case "commentBegin":
      return commentBeginStateReducer(state, action);
    case "commentBody":
      return commentBodyStateReducer(state, action);
    case "commentEnding":
      return commentEndingStateReducer(state, action);
    case "multiDelim1":
      return multiDelim1StateReducer(state, action);
    default:
      const internalError =
        'Internal lexer error. Incident message: "No state match in mainStateReducer"';
      return raiseError(internalError)(state);
  }
};

module.exports = mainStateReducer;
