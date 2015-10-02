$(function() {

  var $pokemon_container = $('.js-pokemon-container'),
      cell_classes = 'pokemon col-xs-4 col-sm-3 col-md-2';

  function cell_for_pokemon(dex_number) {
    if ( has_kc_artwork(dex_number) ) {
      return "<div class='kc " + cell_classes + "'>\
        <img src='images/sugimori/" + dex_number + ".png'>\
      </div>"

    } else {
      return "<div class='sugimori " + cell_classes + "'>\
        <img src='images/sugimori/" + dex_number + ".png'>\
      </div>"
    }
  }

  function has_kc_artwork(dex_number) {
    // We'll test for KC's artwork here... SOON
    // For now let's just pick a random number and return true for that.
    if ( dex_number % 5 == Math.floor(Math.random() * 5) ) {
      return true;
    } else {
      return false;
    }
  }

  for ( i = 1; i <= 721; i++ ) {
    $pokemon_container.append( cell_for_pokemon(i) );
  }

});
