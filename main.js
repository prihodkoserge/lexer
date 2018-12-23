const runScanner = require("./src/scanner");
const ui = require("./src/ui");

const fileContent = `PROGRAM TESTPROGRAM;
  BEGIN
    FOR TESTVARIABLE := 12
    ENDFOR
    (**)   ENDFOR
  END

  BEGIN
    FOR TESTVARIABLE := 12
    ENDFOR
    (**)   ENDFOR
  END
  BEGIN
    FOR TESTVARIABLE := 12
    ENDFOR
    (**)   ENDFOR
  END
  BEGIN
    FOR TESTVARIABLE := 12
    ENDFOR
    (**)   ENDFOR
  END
  BEGIN
    FOR TESTVARIABLE := 12
    ENDFOR
    (**)   ENDFOR
  END
  BEGIN
    FOR TESTVARIABLE := 12
    ENDFOR
    (**)   ENDFOR
  END
  BEGIN
    FOR TESTVARIABLE := 12
    ENDFOR
    (**)   ENDFOR
  END
  BEGIN
    FOR TESTVARIABLE := 12
    ENDFOR
    (**)   ENDFOR
  END
  BEGIN
    FOR TESTVARIABLE := 12
    ENDFOR
    (**)   ENDFOR
  END
  BEGIN
    FOR TESTVARIABLE := 12
    ENDFOR
    (**)   ENDFOR
  END
  
  `;

const scanResult = runScanner(fileContent);

ui.tableRenderer("Identifiers", scanResult.identifiers);
ui.tableRenderer("Constants", scanResult.constants);
ui.tableRenderer("Keywords", scanResult.keywords);
ui.tableRenderer("Lexemes", scanResult.lexemes);
ui.errorsRenderer(scanResult.errors);
