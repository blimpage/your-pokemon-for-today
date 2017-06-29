var csv = require("csv");
var fs = require("fs");

var json_data = JSON.parse(fs.readFileSync("data/all_pokemon.json"));

csv.parse(fs.readFileSync("data/temp_pokemon_types.csv"), function(err, data) {
  data.forEach(function(line) {
    var num = line[0];

    if (/^\d+$/.test(num) && line[1] != "Hoopa (U)") { // get rid of alternate formes, "386.1" etc. Hoopa has the same number twice though for some reason, filter that out specifically.
      json_data[num].type_1 = line[2].toLowerCase();
      json_data[num].type_2 = line[3].toLowerCase() || null;
    }
  });

  fs.writeFileSync("data/all_pokemon.json", JSON.stringify(json_data));
});
