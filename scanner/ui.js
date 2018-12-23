const tableRenderer = (name, values, headers) => {
  console.log("✅ Output for ", name);
  console.table(values, headers);
  console.log("\n\n");
};

const errorsRenderer = values => {
  if (values.length) {
    console.log(`❗️ Found ${values.length} error(s).`);
    values.forEach(error => {
      console.log("❌ ", error);
    });
  } else {
    console.log(`✅ There are no errors`);
  }
  console.log("\n\n");
};
module.exports = {
  tableRenderer,
  errorsRenderer
};
