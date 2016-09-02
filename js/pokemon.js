var kc_pokemon = {

  config: {
    cell_class:      'pokemon',
    cell_done_class: 'js-done',
    container_class: 'pokemon-container',
    batch_load_size: 30,
    thumbnail_size:  200
  },

  $loading:           $('.js-loading'),
  $window:            $(window),
  $body:              $('body'),

  init: function() {
    var self = this;

    self.$body.addClass('js-initialised');

    self._adjust_layout_for_ios();
    self._transform_next_batch_if_needed({ retry_on_success: true });
    self._init_vendor();

    self.$window.bind('scroll.pokemon', $.proxy(_.throttle(self._transform_next_batch_if_needed, 500), self));
  },

  _transform_next_batch_if_needed: function(options) {
    var settings = Object.assign({ retry_on_success: false }, options);

    var window_bottom = this.$window.scrollTop() + this.$window.innerHeight(),
        loading_top   = this.$loading.position().top,
        diff          = this.config.thumbnail_size * 3;

    var time_to_load_more = (window_bottom + diff >= loading_top);

    if (time_to_load_more) {
      this._transform_next_batch();

      if (settings.retry_on_success) {
        this._transform_next_batch_if_needed({ retry_on_success: true });
      }
    }
  },

  _transform_next_batch: function() {
    var self = this;

    var selector = '.' + self.config.cell_class + ':not(.' + self.config.cell_done_class + ')';
    var cells = $(selector).slice(0, self.config.batch_load_size);

    if ( cells.length > 0 ) {
      cells.each(function(index) {
        self._transform_cell($(this));
      });

    } else {
      self._remove_loading_spinner();
      self.$window.unbind('scroll.pokemon');
    }
  },

  _transform_cell: function($cell) {
    if ( $cell.hasClass('pokemon--kc') ) {
      this._transform_kc_cell($cell[0]);
    } else if ( $cell.hasClass('pokemon--sugimori') ) {
      this._transform_sugimori_cell($cell);
    }
  },

  _transform_kc_cell: function(cell) {
    var thumb     = document.createElement('img');
    var thumb_src = cell.dataset.thumb;
    var thumb_alt = cell.title;

    thumb.src    = thumb_src;
    thumb.alt    = thumb_alt;
    thumb.width  = this.config.thumbnail_size;
    thumb.height = this.config.thumbnail_size;

    while (cell.firstChild) {
      cell.removeChild(cell.firstChild);
    }

    cell.appendChild(thumb);

    cell.classList.add(this.config.cell_done_class);
  },

  _transform_sugimori_cell: function($cell) {
    var sprite_url = $cell.attr('data-sprite-url');
    var y_offset   = $cell.attr('data-y-offset');

    $inner_div = $("<div></div>").css({
      'background-image':    'url(' + sprite_url + ')',
      'background-position': '0 ' + y_offset
    });

    $cell.html($inner_div);

    $cell.addClass(this.config.cell_done_class);
  },

  _init_vendor: function() {
    lightGallery(document.querySelector('.' + this.config.container_class), {
      selector: '.pokemon--kc'
    });
  },

  _remove_loading_spinner: function() {
    this.$loading.remove();
  },

  _adjust_layout_for_ios: function() {
    // User agent sniffing sucks, but parts of flexbox are still broken in mobile Safari as of iOS 9. :(
    if ( /iPad|iPhone|iPod/.test(navigator.platform) ) {
      this.$body.addClass('no-flexbox');
    } else {
      this.$body.addClass('flexbox');
    }
  }
};

$(function() {
  kc_pokemon.init();
});
