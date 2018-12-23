const actions = require("./stateActions");

const compose = (...fns) => x => fns.reduceRight((y, f) => f(y), x);

const enterStateReducerHOF = reducerFn => (state, action) =>
  reducerFn({ ...state, checkpoint: state.normalizedPos }, action);

const numberStateReducer = (state, action) => {
  if (action.symbolClass === "digit") {
    return compose(
      actions.setNext("number"),
      actions.updateCurrentLexeme(action.input),
      actions.movePointer(action.input)
    )(state);
  }

  return compose(
    actions.setNext("input"),
    actions.addConstant(state.currentLexeme, state.checkpoint),
    actions.resetCurrentLexeme()
  )(state);
};

const idnStateReducer = (state, action) => {
  if (["letter", "digit"].includes(action.symbolClass)) {
    return compose(
      actions.setNext("idn"),
      actions.updateCurrentLexeme(action.input),
      actions.movePointer(action.input)
    )(state);
  }

  return compose(
    actions.setNext("input"),
    actions.addIdentifier(state.currentLexeme, state.checkpoint),
    actions.resetCurrentLexeme()
  )(state);
};

const spaceStateReducer = (state, action) =>
  compose(
    actions.setNext("input"),
    actions.movePointer(action.input)
  )(state);

const singleDelimStateReducer = (state, action) => {
  return compose(
    actions.setNext("input"),
    actions.movePointer(action.input),
    actions.addSingleDelim(action.input, state.checkpoint)
  )(state);
};

const commentEnterStateReducer = (state, action) =>
  compose(
    actions.setNext("commentBegin"),
    actions.movePointer(action.input)
  )(state);

const commentBeginStateReducer = (state, action) => {
  if (action.input === "*") {
    return compose(
      actions.setNext("commentBody"),
      actions.movePointer(action.input)
    )(state);
  }

  return compose(
    actions.raiseError(error),
    actions.setNext("input"),
    actions.movePointer(action.input)
  )(state);
};

const commentBodyStateReducer = (state, action) => {
  if (action.symbolClass === "eof") {
    return compose(
      actions.raiseError(`Unexpected end of file. Comment is not closed.`),
      state => ({ ...state, done: true })
    )(state);
  }

  const next = action.input === "*" ? "commentEnding" : state.current;
  return compose(
    actions.setNext(next),
    actions.movePointer(action.input)
  )(state);
};

const commentEndingStateReducer = (state, action) => {
  if (action.symbolClass === "eof") {
    return compose(
      actions.raiseError(`Unexpected end of file. Comment is not closed.`),
      state => ({ ...state, done: true })
    )(state);
  }

  const next =
    action.input === "*"
      ? state.current
      : action.input === ")"
      ? "input"
      : "commentBody";

  return compose(
    actions.setNext(next),
    actions.movePointer(action.input)
  )(state);
};

const enterMultiDelim1StateReducer = (state, action) =>
  compose(
    actions.setNext("multiDelim1"),
    actions.movePointer(action.input),
    actions.updateCurrentLexeme(action.input)
  )(state);

const multiDelim1StateReducer = (state, action) => {
  if (action.input === "=") {
    return compose(
      actions.setNext("input"),
      actions.addMultiDelim(
        state.currentLexeme + action.input,
        state.checkpoint
      ),
      actions.resetCurrentLexeme(),
      actions.movePointer(action.input)
    )(state);
  }

  const error = `Unexpected token. Expected "=", but got "${action.input}" `;
  return compose(
    actions.raiseError(error),
    actions.movePointer(action.input),
    actions.setNext("input")
  )(state);
};

const inputStateReducer = (state, action) => {
  switch (action.symbolClass) {
    case "letter":
      return enterStateReducerHOF(idnStateReducer)(state, action);
    case "digit":
      return enterStateReducerHOF(numberStateReducer)(state, action);
    case "space":
      return enterStateReducerHOF(spaceStateReducer)(state, action);
    case "singleDelim":
      return enterStateReducerHOF(singleDelimStateReducer)(state, action);
    case "commentEnter":
      return enterStateReducerHOF(commentEnterStateReducer)(state, action);
    case "multiDelim1":
      return enterStateReducerHOF(enterMultiDelim1StateReducer)(state, action);
    case "eof":
      return { ...state, done: true };
    default:
      const error = `Char "${action.input}" at position (${
        state.normalizedPos.row
      }, ${state.normalizedPos.column}) is not recognized`;
      return compose(
        actions.raiseError(error),
        actions.movePointer()
      )(state);
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
