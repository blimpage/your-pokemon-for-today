var kc_pokemon = {

  config: {
    cell_classes:       'col-xs-4 col-sm-3 col-md-2',
    lazyload_threshold: 24,
    total_pokemon:      721,
    spriteset_size:     50,
    thumbnail_size:     200
  },

  $pokemon_container: $('.js-pokemon-container'),

  init: function() {
    this.config.last_spriteset = Math.floor(this.config.total_pokemon / this.config.spriteset_size);

    var that = this;

    $.getJSON('data/kc.json')
      .done(function(data) {

        that.kc_data = data;
        that._display_pokemon();
        that._init_vendor();

      })
      .fail(function() {
        that.$pokemon_container.prepend('<p class="bg-danger error">Oh nooooo, something went wrong :(</p>');
      });
  },

  _display_pokemon: function() {
    for ( i = 1; i <= this.config.total_pokemon; i++ ) {
      this.$pokemon_container.append( this._new_cell_for_pokemon(i) );
    }
  },

  _init_vendor: function() {
    $('.swipebox').swipebox();

    $('img.lazy').lazyload({
      effect: 'fadeIn',
      placeholder: 'images/loading.gif'
    });
  },

  _new_cell_for_pokemon: function(dex_number) {
    if ( this._has_kc_artwork(dex_number) ) {
      return this._cell_for_kc_art(dex_number);
    } else {
      return this._cell_for_sugimori_art(dex_number);
    }
  },

  _cell_for_kc_art: function(dex_number) {
    return "<div class='pokemon " + this.config.cell_classes + "'>\
      <a href='images/kc/" + dex_number + ".png' class='swipebox' title='" + this._pokemon_name(dex_number) + "'>\
        <img " + this._img_src_attribute(dex_number) + "\
        alt='" + this._pokemon_name(dex_number) + "'\
        width='" + this.config.thumbnail_size + "'\
        height='" + this.config.thumbnail_size + "'>\
      </a>\
    </div>";
  },

  _img_src_attribute: function(dex_number) {
    if ( dex_number <= this.config.lazyload_threshold ) {
      return "src='images/kc/thumbs/" + dex_number + ".png'";
    } else {
      return "class='lazy' data-original='images/kc/thumbs/" + dex_number + ".png'";
    }
  },

  _cell_for_sugimori_art: function(dex_number) {
    var spriteset = Math.ceil(dex_number / this.config.spriteset_size) - 1,
        offset_y = ((dex_number - 1) % this.config.spriteset_size) * (1 / (this._images_in_set(spriteset) - 1) * 100);

    return "<div class='" + this.config.cell_classes + "'>\
      <div class='pokemon--sugimori' style='\
        background-image: url(/images/sugimori/sugimori_" + spriteset + ".jpg);\
        background-position: 0 " + offset_y + "%;
      '>\
      </div>\
    </div>";
  },

  _images_in_set: function(spriteset) {
    if ( spriteset < this.config.last_spriteset ) {
      return this.config.spriteset_size;
    } else {
      return this.config.total_pokemon - (this.config.last_spriteset * this.config.spriteset_size);
    }
  },

  _has_kc_artwork: function(dex_number) {
    return this.kc_data[dex_number] !== undefined;
  },

  _pokemon_name: function(dex_number) {
    return this.kc_data[dex_number];
  }
};

$(function() {
  kc_pokemon.init();
});
