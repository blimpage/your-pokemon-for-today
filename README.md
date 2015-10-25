# [Your Pokémon for Today](http://your-pokemon-for-today.surge.sh/)

This is a nice little gallery site showing off the rad [Your Pokémon for Today](http://midnitesurprise.com/tagged/yourpokemonfortoday) illustrations that the rad [KC Green](http://kcgreendotcom.com/) has been posting on his Twitter and Tumblrs.

It doesn't really need to exist, and yet it does!!

On the webby end, it uses [Swipebox](https://github.com/brutaldesign/swipebox) for lightboxy stuff, [Lazy Load](https://github.com/tuupola/jquery_lazyload) to mitigate the loading of 700+ images, and [Bootstrap](https://github.com/twbs/bootstrap) for basic styling.

On the buildy end, it uses [GraphicsMagick for Node](https://github.com/aheckmann/gm) to generate thumbnails for each illustration, and [gulp](http://gulpjs.com/) (and a whole host of gulp plugins) to rope the whole thing together.

It's currently hosted on [Surge](http://surge.sh/) because omg that service is amazing.


## To build it yourself

So you wanna be a Digimon master huh???? Here's how to build a version of this site on your own computer:

1. Get a copy of this repository (either by [cloning it](https://help.github.com/articles/cloning-a-repository/) or [downloading a ZIP copy](https://github.com/blimpage/your-pokemon-for-today/archive/master.zip) and unzipping it)

2. Make sure you've [got Node.js and npm installed](https://docs.npmjs.com/getting-started/installing-node), as well as [Homebrew](http://brew.sh/)

3. **Install GraphicsMagick for Node:** Open a command line tool and run `brew install graphicsmagick`

4. **Install the project's dependencies:** In your command line tool, navigate to the project folder and run `npm install`

5. **Build the site from the source files:** In the same folder, run `gulp`. The site is done building when you see `Finished 'default'` and you get your command prompt back.

6. Look in the "build" folder - there's your site! WOW!

7. To open the site in a web browser, you'll need to be running a web server in the "build" folder - [here's my favourite simple way to do that on a Mac](http://osxdaily.com/2010/05/07/create-an-instant-web-server-via-terminal-command-line/).

Dat's it! If you make any changes, run step 5 again to build a new version of the site. Then please feel free to [submit a pull request with your changes](https://help.github.com/articles/creating-a-pull-request/)! Collaboration is fun.


## Todo

Maybe you wanna help me do these things???

- Convert thumbnails into a spritesheet (and make sure they load nicely? Gotta make sure that the first few Pokémon are visible when the page loads)

- ~~Create a script to handle processing of images:~~

  - ~~Create a 200px~~ PNG-8 (whoops, needa add a conversion step) ~~thumbnail of each full-size image~~

  - ~~Optimise both the full-size image and the thumbnail~~

  - Maybe even generate the JSON file based on what images are present?

  - Maybe even exclude Sugimori images from the spritesheet based on whether or not a KC image is present?? :o

- ~~Concatenate and minify CSS & JS~~

- Add a filtering option to _only_ display KC's images (and maybe one to show only ones he hasn't done? Would anyone ever even want that?)

- Add an option to sort by date

- Add a "watch" task to the gulp config, to automatically rebuild the relevant build files when the source files change

- Add a random hash to each build of the CSS and JS files, to ensure cache-busting (would need to add templating to index.html to allow dynamic insertion of the generated filename :/ )

- Add a "Last updated" date to index.html (again, would need to add templating)
