const readFileContent = path => fs.readFileSync(path, "utf8");

const getSymbolClass = char => {
  const asciiCode = char.charCodeAt(0);
  if (
    (asciiCode > 64 && asciiCode < 91) ||
    (asciiCode > 96 && asciiCode < 123)
  ) {
    return "letter";
  } else if (asciiCode > 47 && asciiCode < 58) {
    return "digit";
  } else if (asciiCode === 32 || (asciiCode > 7 && asciiCode < 14)) {
    return "space";
  } else if (";,./\\+-={}!*)".includes(char)) {
    return "singleDelim";
  } else if (char === "(") {
    return "commentEnter";
  } else if (char === ":") {
    return "multiDelim1";
  }
};

const makeInputAction = input => ({
  input,
  symbolClass: getSymbolClass(input)
});

module.exports = {
  readFileContent,
  getSymbolClass,
  makeInputAction
};
