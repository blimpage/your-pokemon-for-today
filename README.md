# [Your Pokémon for Today](http://your-pokemon-for-today.surge.sh/)

This is a nice little gallery site showing off the rad [Your Pokémon for Today](http://midnitesurprise.com/tagged/yourpokemonfortoday) illustrations that the rad [KC Green](http://kcgreendotcom.com/) has been posting on his Twitter and Tumblrs.

It doesn't really need to exist, and yet it does!!

On the webby end, it uses [Swipebox](https://github.com/brutaldesign/swipebox) for lightboxy stuff, and bits of [jQuery](https://github.com/jquery/jquery) and [Underscore.js](https://github.com/jashkenas/underscore) for added dev functionality.

On the buildy end, it uses [GraphicsMagick for Node](https://github.com/aheckmann/gm) to generate thumbnails for each illustration, and [gulp](http://gulpjs.com/) (and a whole host of gulp plugins) to rope the whole thing together.

It's currently hosted on [Surge](http://surge.sh/) because omg that service is amazing.


## To build it yourself

So you wanna be a Digimon master huh???? Here's how to build a version of this site on your own computer (if you're running Mac OS X):

1. Get a copy of this repository (either by [cloning it](https://help.github.com/articles/cloning-a-repository/) or [downloading a ZIP copy](https://github.com/blimpage/your-pokemon-for-today/archive/master.zip) and unzipping it)

2. Make sure you've [got Node.js and npm installed](https://docs.npmjs.com/getting-started/installing-node), as well as [Homebrew](http://brew.sh/)

3. **Install GraphicsMagick:** Open a command line tool and run `brew install graphicsmagick`

4. **Install the project's dependencies:** In your command line tool, navigate to the project folder and run `npm install`

5. **Build the site from the source files:** In the same folder, run `gulp` (if you get a `command not found` error, try [this solution](http://blog.webbb.be/command-not-found-node-npm/)). The site is done building when you see `Finished 'default'` and you get your command prompt back.

6. Look in the "build" folder - there's your site! WOW!

7. To open the site in a web browser, you'll need to be running a web server in the "build" folder - [here's my favourite simple way to do that on a Mac](http://osxdaily.com/2010/05/07/create-an-instant-web-server-via-terminal-command-line/).

Dat's it! If you make any changes, run step 5 again to build a new version of the site. Then please feel free to [submit a pull request with your changes](https://help.github.com/articles/creating-a-pull-request/)! Collaboration is fun.


## Todo

Maybe you wanna help me do these things???

- ~~Convert thumbnails into a spritesheet and make sure they load nicely - the first few Pokémon should be visible when the page loads, but we shouldn't download the entire spritesheet right away~~

  - ~~Prevent generation of stylesheets for the spritesheets (or delete them from the build folder after they're created), cause we don't need 'em!~~

- ~~Create a script to handle processing of images:~~

  - ~~Create a 200px PNG-8 thumbnail of each full-size image~~

  - ~~Optimise both the full-size image and the thumbnail~~

  - Maybe even generate the JSON file based on what images are present?

  - Maybe even exclude Sugimori images from the spritesheet based on whether or not a KC image is present?? :o

    - Tried to do this, but it's difficult since spritesmith ignores duplicate images. So if you want to insert a blank image into a spritesheet multiple times, then you need to use multiple blank images! :(

- ~~Concatenate and minify CSS & JS~~

- Add a filtering option to _only_ display KC's images (and maybe one to show only ones he hasn't done? Would anyone ever even want that?)

- Add an option to sort by date

- Add a "watch" task to the gulp config, to automatically rebuild the relevant build files when the source files change

- Combine the data JSON file with the main HTML or JS, so we're not ajax'ing for it after the page loads. One less request, baby!

- Add a random hash to each build of the CSS and JS files, to ensure cache-busting (would need to add templating to index.html to allow dynamic insertion of the generated filename :/ )

- Add a "Last updated" date to index.html (again, would need to add templating)

- Add a favicon

- Don't convert all JPGs to PNGs. Some KC images are JPGs, but for convenience's sake we convert them all to PNG. This results in a larger filesize without any change in image quality, so we should really keep them as JPG.
