var csv = require("csv");
var fs = require("fs");

csv.parse(fs.readFileSync("data/temp_pokemon_types.csv"), function(err, data) {
  console.log(data);
});
