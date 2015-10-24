# [Your Pokémon for Today](http://blimpage.github.io/your-pokemon-for-today/)

This is a nice little gallery site showing off the rad [Your Pokémon for Today](http://midnitesurprise.com/tagged/yourpokemonfortoday) illustrations that the rad [KC Green](http://kcgreendotcom.com/) has been posting on his Twitter and Tumblrs.

It doesn't really need to exist, and yet it does!!

It uses [Swipebox](https://github.com/brutaldesign/swipebox) for lightboxy stuff, [Lazy Load](https://github.com/tuupola/jquery_lazyload) to mitigate the loading of 700+ images, and [Bootstrap](https://github.com/twbs/bootstrap) for basic styling.

## Todo

- Convert thumbnails into a spritesheet (and make sure they load nicely? make sure that the first few Pokémon are visible when the page loads)

- Create a script to handle processing of images:

  - Create a 200px PNG-8 thumbnail of each full-size image

  - Optimise both the full-size image and the thumbnail

  - Maybe even generate the JSON file based on what images are present?

  - Maybe even exclude Sugimori images from the spritesheet based on whether or not a KC image is present?? :o

- Concatenate and minify CSS & JS

- Add a filtering option to _only_ display KC's images (and maybe one to show only ones he hasn't done? Would anyone ever even want that?)

- Add an option to sort by date
