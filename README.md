Soyloco frontend
=====================

## Using this project


### 0. Install Node.js and Cordova
First, install Node.js. Then, install the latest Cordova and Ionic command-line tools.
Follow the Android and iOS platform guides to install required platform dependencies.

### 1. Install Cordova plugins

#### Before building and running or emulating the app, we need to install the
require Cordova plugins.

Enter the project
```bash
$ cd soyloco-frontend
```

Basic device information:
```bash
$ cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-device.git
```

Network Connection and Battery Events:
```bash
$ cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-network-information.git
```

Device orientation:
```bash
$ cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-device-orientation.git
```

### 2. Install Ionic

Make sure the `ionic` utility is installed:

```bash
$ sudo npm install -g ionic
```

### 3. Install dependencies and add the Android platform

```bash
$ bower install
$ ionic platform add android
```

### 4. Add Phonegap Facebook plugin for Android
phonegap facebook plugin available at [phonegap-facebook-plugin](https://github.com/phonegap/phonegap-facebook-plugin.git)


#### How to build and deploy?

The folks over [here](https://github.com/Wizcorp/phonegap-facebook-plugin/blob/develop/platforms/android/README.md) wrote this
life saver of a command line process that saved my day. So whatever goes forward is a repetition but specific to this project.
(The steps below are for ionic and android. The ios version works with a regular plugin add)

1. Checkout this project
2. ionic platform add android
3. cordova -d plugin add https://github.com/phonegap/phonegap-facebook-plugin.git --variable APP_ID="YOUR_APP_ID" --variable APP_NAME="YOUR_APP_NAME"
   (replace the app_id and app_name with an app that you have created on facebook)
4. android update project --subprojects --path "platforms/android" --target android-19 --library "CordovaLib"
5. android update project --subprojects --path "platforms/android" --target android-19 --library "com.phonegap.plugins.facebookconnect/FacebookLib"
6. android update project --path "platforms/android/com.phonegap.plugins.facebookconnect/FacebookLib" --target android-19
7. cd platforms/android/
8. ant clean
9. cd com.phonegap.plugins.facebookconnect/FacebookLib
10. ant clean
12. open -e AndroidManifest.xml  (It worked without this for me)
 change your minSdkVersion and your targetSdkVersion to your environment settings for me it was:
 <uses-sdk android:minSdkVersion="14" android:targetSdkVersion="17" />
13. mkdir ant-build
13. ant release
14. cd ../../../.. (this should bring you back to the project root)

#### Facebook login

Configure your keyhash on the facebook app (step 3).

#### There are still bugs on the plugin for android when we remove the app from the permissions list, which already has a patch.


#### Now we are ready to build and run/emulate Soyloco-frontend
Ionic apps are based on Cordova, so we can use the Cordova utilities
to build, test, and deploy our apps, but Ionic provides simple ways to do
the same with the ionic utility (substitute android for ios to build for ios):

```bash
$ ionic build android
$ ionic run android
```

More info on this can be found on the Ionic [Getting Started](http://ionicframework.com/getting-started) page.


### 5. Using Sass

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

