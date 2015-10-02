$(function() {

  var $pokemon_container = $('.js-pokemon-container'),
      cell_classes = 'pokemon col-xs-4 col-sm-3 col-md-2 col-lg-1'

  for ( i = 1; i <= 151; i++ ) {
    $pokemon_container.append(
      "<div class='" + cell_classes + "'>\
        <img src='images/sugimori/" + i + ".png'>\
      </div>");
  }

});
