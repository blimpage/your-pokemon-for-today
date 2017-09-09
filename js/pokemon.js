var kc_pokemon = {

  config: {
    cell_class:          'pokemon',
    kc_cell_class:       'pokemon--kc',
    sugimori_cell_class: 'pokemon--sugimori',
    cell_done_class:     'js-done',
    what_is_kc_class:    'what-is-kc',
    thumbnail_width:     245,
    thumbnail_height:    155
  },

  container_element: document.querySelector('.pokemon-container'),

  init: function() {
    var self = this;

    document.body.classList.add('js-initialised');

    self._adjust_layout_for_ios();
    self._transform_all_cells();
    self._decide_what_kc_is();
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
    var has_kc_image = cell.dataset.hasKcImage;

    var name = has_kc_image ? cell.dataset.name : '';
    var dex_number = has_kc_image ? '#' + cell.dataset.dexNumber : '???'
    var authorClass = has_kc_image ? this.config.kc_cell_class : this.config.sugimori_cell_class;
    var typeClass = has_kc_image ? 'type--' + cell.dataset.type : 'type--unknown';

    // The "target" element that we're going to drop our new elements into
    // should be the innermost child element of the cell element.
    // And we wanna remove any text that's in there.
    var target = cell;
    while (target.firstElementChild) {
      target = target.firstElementChild;
      target.innerText = null;
    }

    var thumb              = document.createElement('img');
    thumb.dataset.original = cell.dataset.thumbUrl;
    thumb.width            = this.config.thumbnail_width;
    thumb.height           = this.config.thumbnail_height;

    var outer = document.createElement('div');
    outer.classList.add(
      'pokemon-card',
      this._rando_rotation_class(),
      typeClass
    );

    var thumb_container = document.createElement('div');
    thumb_container.classList.add('pokemon-card__thumb-container');

    var text_container = document.createElement('div');
    text_container.classList.add('pokemon-card__text');
    text_container.innerText = dex_number + ' ' + name;

    thumb_container.appendChild(thumb);
    outer.appendChild(thumb_container);
    outer.appendChild(text_container);
    target.appendChild(outer);

    cell.classList.add(this.config.cell_done_class, authorClass);
  },

  _init_vendor: function() {
    lightGallery(this.container_element, {
      selector: 'a'
    });

    new LazyLoad({
      elements_selector: '.pokemon-card img'
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

  _decide_what_kc_is: function() {
    // Adjusts the text in the intro section to clarify who or what KC is.
    document.querySelector('.' + this.config.what_is_kc_class).innerText = this._something_kc_might_be();
  },

  _something_kc_might_be: function() {
    var things_kc_might_be = [
      "a malevolent spirit",
      "somebody's uncle",
      "a heavy metal guitarist",
      "a distinguished tastemaker",
      "an ancient evil",
      "a Donkey Kong enthusiast",
      "a cheesemaker of much acclaim",
      "clearly a legend",
      "a good friend",
      "a forest dweller",
      "some guy I met at a gas station",
      "a gift from the heavens",
      "the meme dog guy, but also a very talented artist with a large library of work",
      "just a guy",
    ];

    return things_kc_might_be[Math.floor(Math.random() * things_kc_might_be.length)];
  },

  _rando_rotation_class: function() {
    return 'rando-rotation--' + Math.ceil(Math.random() * 10);
  }
};

document.addEventListener('DOMContentLoaded', kc_pokemon.init.bind(kc_pokemon));
