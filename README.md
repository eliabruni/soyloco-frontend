Soyloco
=====================

## Using this project


### 0. Install Node.js and Cordova
First, install Node.js. Then, install the latest Cordova and Ionic command-line tools.
Follow the Android and iOS platform guides to install required platform dependencies.


### 1. Install Ionic

Make sure the `ionic` utility is installed:

```bash
$ sudo npm install -g ionic
```

### 2. Run Soyloco
Ionic apps are based on Cordova, so we can use the Cordova utilities
to build, test, and deploy our apps, but Ionic provides simple ways to do
the same with the ionic utility (substitute ios for android to build for Android):

```bash
$ cd soyloco
$ ionic platform add ios
$ ionic build ios
$ ionic emulate ios
```

More info on this can be found on the Ionic [Getting Started](http://ionicframework.com/getting-started) page.


## Using Sass

This project makes it easy to use Sass (the SCSS syntax) in your projects. This enables you to override styles from Ionic, and benefit from
Sass's great features.

Just update the `./scss/ionic.app.scss` file, and run `gulp` or `gulp watch` to rebuild the CSS files for Ionic.

Note: if you choose to use the Sass method, make sure to remove the included `ionic.css` file in `index.html`, and then uncomment
the include to your `ionic.app.css` file which now contains all your Sass code and Ionic itself:

```html
<!-- IF using Sass (run gulp sass first), then remove the CSS include above
<link href="css/ionic.app.css" rel="stylesheet">
-->
```

