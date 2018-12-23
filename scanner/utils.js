const readFileContent = path => fs.readFileSync(path, "utf8");

const getSymbolClass = char => {
  if (typeof char === "undefined") {
    return "eof";
  }

  const asciiCode = char.charCodeAt(0);
  if (asciiCode > 64 && asciiCode < 91) {
    return "letter";
  } else if (asciiCode > 47 && asciiCode < 58) {
    return "digit";
  } else if (asciiCode === 32 || (asciiCode > 7 && asciiCode < 14)) {
    return "space";
  } else if (";+-".includes(char)) {
    return "singleDelim";
  } else if (char === "(") {
    return "commentEnter";
  } else if (char === ":") {
    return "multiDelim1";
  } else {
    return "unknown";
  }
};

const makeInputAction = input => ({
  input,
  symbolClass: getSymbolClass(input)
});

const makeLexeme = (value, checkpoint) => ({
  value,
  checkpoint
});

const getNormalizedPos = (state, input) => {
  const { row, column } = state.normalizedPos;
  return input === "\n"
    ? { row: row + 1, column: 1 }
    : {
        row,
        column: column + 1
      };
};

module.exports = {
  readFileContent,
  getSymbolClass,
  makeInputAction,
  makeLexeme,
  getNormalizedPos
};
