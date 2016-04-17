var kc_pokemon = {

  config: {
    cell_class:        'pokemon',
    cell_hidden_class: 'hidden',
    batch_load_size:   30,
    thumbnail_size:    200
  },

  $pokemon_container: $('.js-pokemon-container'),
  $loading:           $('.js-loading'),
  $window:            $(window),

  init: function() {
    var self = this;

        self._adjust_layout_for_ios();
        self._unhide_next_batch_if_needed({retry_on_success: true});
        self._init_vendor();

        self.$window.bind('scroll.pokemon', $.proxy(_.throttle(self._unhide_next_batch_if_needed, 500), self));
  },

  _unhide_next_batch_if_needed: function(options) {
    var settings = Object.assign({retry_on_success: false}, options);

    var window_bottom = this.$window.scrollTop() + this.$window.innerHeight(),
        loading_top   = this.$loading.position().top,
        diff          = this.config.thumbnail_size * 3;

    var time_to_load_more = (window_bottom + diff >= loading_top);

    if (time_to_load_more) {
      this._unhide_next_batch();

      if (settings.retry_on_success) {
        this._unhide_next_batch_if_needed({retry_on_success: true});
      }
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
  }
};

$(function() {
  kc_pokemon.init();
});
