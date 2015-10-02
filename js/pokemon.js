var kc_pokemon = {

  config: {
    cell_classes: 'pokemon col-xs-4 col-sm-3 col-md-2'
  },

  kc_data: {},

  $pokemon_container: $('.js-pokemon-container'),

  init: function() {
    var that = this;

    $.getJSON('js/kc.json')
      .done(function(data) {
        that.kc_data = data;
        that._display_pokemon();
        $('.swipebox').swipebox();
      })
      .fail(function() {
        that.$pokemon_container.prepend('<p>Oh nooooo, something went wrong :(</p>');
      });
  },

  _display_pokemon: function() {
    for ( i = 1; i <= 721; i++ ) {
      this.$pokemon_container.append( this._new_cell_for_pokemon(i) );
    }
  },

  _new_cell_for_pokemon: function(dex_number) {
    if ( this._has_kc_artwork(dex_number) ) {
      return "<div class='kc " + this.config.cell_classes + "'>\
        <a href='images/kc/" + dex_number + ".png' class='swipebox'>\
          <img src='images/kc/thumbs/" + dex_number + ".png' width='200' height='200'>\
        </a>\
      </div>"

    } else {
      return "<div class='sugimori " + this.config.cell_classes + "'>\
        <img src='images/sugimori/" + dex_number + ".jpg' width='200' height='200'>\
      </div>"
    }
  },

  _has_kc_artwork: function(dex_number) {
    if ( this.kc_data[dex_number] !== undefined ) {
      return true;
    } else {
      return false;
    }
  }
};

$(function() {
  kc_pokemon.init();
});
