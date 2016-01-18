var kc_pokemon = {

  config: {
    cell_class:        'pokemon',
    cell_hidden_class: 'hidden',
    batch_load_size:   30,
    total_pokemon:     721,
    spriteset_size:    50,
    thumbnail_size:    200
  },

  $pokemon_container: $('.js-pokemon-container'),
  $loading:           $('.js-loading'),
  $window:            $(window),

  init: function() {
    this.config.last_spriteset = Math.floor(this.config.total_pokemon / this.config.spriteset_size);

    var self = this;

    $.getJSON('data/kc.json')
      .done(function(data) {

        self.kc_data = data;
        self._adjust_layout_for_ios();
        self._layout_all_cells();
        self._unhide_next_batch();
        self._init_vendor();

        self.$window.bind('scroll.pokemon', $.proxy(_.throttle(self._on_scroll, 500), self));
      })
      .fail(function() {
        self._remove_loading_spinner();
        self.$pokemon_container.prepend('<p class="bg-danger error">Oh nooooo, something went wrong :(</p>');
      });
  },

  _on_scroll: function() {
    var window_bottom = this.$window.scrollTop() + this.$window.innerHeight(),
        loading_top   = this.$loading.position().top,
        diff          = this.config.thumbnail_size * 3;

    var time_to_load_more = (window_bottom + diff >= loading_top);

    if (time_to_load_more) {
      this._unhide_next_batch();
    }
  },

  _remove_loading_spinner: function() {
    this.$loading.remove();
  },

  _adjust_layout_for_ios: function() {
    // User agent sniffing sucks, but parts of flexbox are still broken in mobile Safari as of iOS 9. :(
    if ( /iPad|iPhone|iPod/.test(navigator.platform) ) {
      $('body').addClass('no-flexbox');
    } else {
      $('body').addClass('flexbox');
    }
  },

  _layout_all_cells: function() {
    for ( i = 1; i <= this.config.total_pokemon; i++ ) {
      this.$pokemon_container.append( this._new_cell_for_pokemon(i) );
    }
  },

  _unhide_next_batch: function() {
    var selector = '.' + this.config.cell_class + '.' + this.config.cell_hidden_class;
    var cells = $(selector).slice(0, this.config.batch_load_size);

    if ( cells.length > 0 ) {
      cells.each(function(index) {
        var cell = $(this);

        if ( cell.hasClass('pokemon--kc') ) {
          var image = cell.find('img').first();
          var image_src = image.attr('data-src');

          image.attr('src', image_src);
          cell.removeClass('hidden');

        } else if ( cell.hasClass('pokemon--sugimori') ) {
          cell.removeClass('hidden');
        }
      });

    } else {
      this._remove_loading_spinner();
      this.$window.unbind('scroll.pokemon');
    }
  },

  _init_vendor: function() {
    $('.swipebox').swipebox();
  },

  _new_cell_for_pokemon: function(dex_number) {
    if ( this._has_kc_artwork(dex_number) ) {
      return this._cell_for_kc_art(dex_number);
    } else {
      return this._cell_for_sugimori_art(dex_number);
    }
  },

  _cell_for_kc_art: function(dex_number) {
    return "<div class='pokemon--kc " + this.config.cell_class + " " + this.config.cell_hidden_class + "'>\
      <a href='images/kc/" + dex_number + ".png' class='swipebox' title='" + this._pokemon_name(dex_number) + "'>\
        <img src='' data-src='images/kc/thumbs/" + dex_number + ".png'\
          alt='" + this._pokemon_name(dex_number) + "'\
          width='" + this.config.thumbnail_size + "'\
          height='" + this.config.thumbnail_size + "' >\
      </a>\
    </div>";
  },

  _cell_for_sugimori_art: function(dex_number) {
    var spriteset = Math.ceil(dex_number / this.config.spriteset_size) - 1,
        offset_y = ((dex_number - 1) % this.config.spriteset_size) * (1 / (this._images_in_set(spriteset) - 1) * 100);

    return "<div class='pokemon--sugimori " + this.config.cell_class + " " + this.config.cell_hidden_class + "'>\
      <div style='\
        background-image: url(/images/sugimori/sugimori_" + spriteset + ".jpg);\
        background-position: 0 " + offset_y + "%;\
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
