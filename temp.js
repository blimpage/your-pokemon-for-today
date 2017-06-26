var fetch = require("node-fetch");

for (i = 1; i < 10; i++) {
  fetch(`http://pokeapi.co/api/v2/pokemon/${i}`)
    .then(function(res) {
      return res.text();
    }).then(function(body) {
      data = JSON.parse(body);
      poke = {
        id: data.id,
        order: data.id,
        name: data.name,
        type1: data.types.filter(type => type.slot == 1)[0].type.name
      };

      if (data.types.length > 1) {
        poke.type2 = data.types.filter(type => type.slot == 2)[0].type.name
      }

      console.log(poke);
    });
}
