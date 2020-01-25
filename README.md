# [Your Pokémon for Today](https://yourpokemonfor.today/)

This is a nice little gallery site showing off the rad [Your Pokémon for Today](http://midnitesurprise.com/tagged/yourpokemonfortoday) illustrations that the rad [KC Green](http://kcgreendotcom.com/) has been posting on his Twitter and Tumblrs.

It doesn't really need to exist, and yet it does!!

On the webby end, it uses [lightgallery.js](https://github.com/sachinchoolur/lightgallery.js) for lightboxy stuff.

On the buildy end, it uses [GraphicsMagick for Node](https://github.com/aheckmann/gm) to generate thumbnails for each illustration, [Nunjucks](http://mozilla.github.io/nunjucks) for templating, and [gulp](http://gulpjs.com/) (and a whole host of gulp plugins) to rope the whole thing together.

The site itself is available for your browsing pleasure at [https://yourpokemonfor.today/](https://yourpokemonfor.today/).

The repository is kind of stupidly huge because it contains a lot of image data (both present and past). Sorry about that.

## To build it yourself

So you wanna be a Digimon master huh???? Here's how to build a version of this site on your own computer (if you're running Mac OS X):

1. Get a copy of this repository (either by [cloning it](https://help.github.com/articles/cloning-a-repository/) or [downloading a ZIP copy](https://github.com/blimpage/your-pokemon-for-today/archive/master.zip) and unzipping it)

2. Make sure you've [got Node.js and Yarn installed](https://legacy.yarnpkg.com/lang/en/docs/install/) (Check in `package.json` under `engines` for the required versions), as well as [Homebrew](http://brew.sh/)

3. **Install GraphicsMagick:** Open a command-line interface and run `brew install graphicsmagick`

4. **Install the project's dependencies:** In your command-line interface, navigate to the project folder and run `yarn`

5. **Build the site from the source files:** In the same folder, run `yarn build`. The site is done building when you see `Finished 'default'` and you get your command prompt back.

   - This command builds the site and processes all of the site's images, so it can take a while (anywhere up to ten minutes) the first time it runs. Subsequent builds will be quicker.

6. Look in the "build" folder - there's your site! WOW!

7. To open the site in a web browser, you'll need to be running a web server in the "build" folder - [here's my favourite simple way to do that on a Mac](http://osxdaily.com/2010/05/07/create-an-instant-web-server-via-terminal-command-line/).

Dat's it! If you make any changes, run step 5 again to build a new version of the site. Then please feel free to [submit a pull request with your changes](https://help.github.com/articles/creating-a-pull-request/)! Collaboration is fun.


## Todo

Maybe you wanna help me do these things???

- Add a filtering option to _only_ display KC's images (and maybe one to show only ones he hasn't done? Would anyone ever even want that?)

- Add an option to sort by date

- Add a "watch" task to the gulp config, to automatically rebuild the relevant build files when the source files change
