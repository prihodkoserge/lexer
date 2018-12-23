const runScanner = require("../scanner/scanner");

const runScanner = require("./src/scanner");
const ui = require("./src/ui");

const fileContent = `PROGRAM TESTPROGRAM;
  BEGIN
    FOR TESTVARIABLE := 12
    ENDFOR
    (**)   ENDFOR
  END
  `;

const scanResult = runScanner(fileContent);

console.log(scanResult);

export default function() {
  console.log("Not implemented yet");
}
