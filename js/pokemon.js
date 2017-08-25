var kc_pokemon = {

  config: {
    cell_class:       'pokemon',
    cell_done_class:  'js-done',
    thumbnail_width:  245,
    thumbnail_height: 155
  },

  container_element: document.querySelector('.pokemon-container'),

  init: function() {
    var self = this;

    document.body.classList.add('js-initialised');

    self._adjust_layout_for_ios();
    self._transform_all_cells();
    self._init_vendor();
  },

  _transform_all_cells: function() {
    var self = this;

    var selector = '.' + self.config.cell_class + ':not(.' + self.config.cell_done_class + ')';
    var all_cells_nodelist = document.querySelectorAll(selector);
    var all_cells = Array.prototype.slice.call(all_cells_nodelist);

    all_cells.forEach(function(cell) {
      self._transform_cell(cell);
    });
  },

  _transform_cell: function(cell) {
    if ( cell.classList.contains('pokemon--kc') ) {
      this._transform_kc_cell(cell);
    } else if ( cell.classList.contains('pokemon--sugimori') ) {
      this._transform_sugimori_cell(cell);
    }
  },

  _transform_kc_cell: function(cell) {
    var thumb     = document.createElement('img');
    var thumb_src = cell.dataset.thumb;
    var thumb_alt = cell.title;

    thumb.src    = thumb_src;
    thumb.alt    = thumb_alt;
    thumb.width  = this.config.thumbnail_width;
    thumb.height = this.config.thumbnail_height;

    while (cell.firstChild) {
      cell.removeChild(cell.firstChild);
    }

    var outer = document.createElement('div');
    outer.classList.add('pokemon-card', this._rando_rotation_class(), 'type--' + cell.dataset.type);

    var thumb_container = document.createElement('div');
    thumb_container.classList.add('pokemon-card__thumb-container');

    var text_container = document.createElement('div');
    text_container.classList.add('pokemon-card__text');
    text_container.innerText = cell.dataset.dexNumber + ' ' + cell.title;

    thumb_container.appendChild(thumb);
    outer.appendChild(thumb_container);
    outer.appendChild(text_container);
    cell.appendChild(outer);

    cell.classList.add(this.config.cell_done_class);
  },

  _transform_sugimori_cell: function(cell) {
    var thumb     = document.createElement('img');
    var thumb_src = cell.dataset.thumb;

    thumb.src    = thumb_src;
    thumb.alt    = '???';
    thumb.width  = this.config.thumbnail_width;
    thumb.height = this.config.thumbnail_height;

    while (cell.firstChild) {
      cell.removeChild(cell.firstChild);
    }

    var outer = document.createElement('div');
    outer.classList.add('pokemon-card', this._rando_rotation_class());

    var thumb_container = document.createElement('div');
    thumb_container.classList.add('pokemon-card__thumb-container');

    var text_container = document.createElement('div');
    text_container.classList.add('pokemon-card__text');
    text_container.innerText = '???';

    thumb_container.appendChild(thumb);
    outer.appendChild(thumb_container);
    outer.appendChild(text_container);
    cell.appendChild(outer);

    cell.classList.add(this.config.cell_done_class);
  },

  _init_vendor: function() {
    lightGallery(this.container_element, {
      selector: '.pokemon--kc'
    });
  },

  _adjust_layout_for_ios: function() {
    // User agent sniffing sucks, but parts of flexbox are still broken in mobile Safari as of iOS 9. :(
    if ( /iPad|iPhone|iPod/.test(navigator.platform) ) {
      document.body.classList.add('no-flexbox');
    } else {
      document.body.classList.add('flexbox');
    }
  },

  _rando_rotation_class: function() {
    return 'rando-rotation--' + Math.ceil(Math.random() * 10);
  }
};

document.addEventListener('DOMContentLoaded', kc_pokemon.init.bind(kc_pokemon));
