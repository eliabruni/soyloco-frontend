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
cd soyloco-frontend
```

The cordova.plugins.Keyboard object provides functions to make interacting with the keyboard:
```bash
cordova plugin add com.ionic.keyboard
```

Basic device information:
```bash
cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-device.git
```

Network Connection and Battery Events:
```bash
cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-network-information.git
```

Device orientation:
```bash
cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-device-orientation.git
```

Cordova toast
```bash
cordova plugin add https://github.com/EddyVerbruggen/Toast-PhoneGap-Plugin.git
```


File:
```bash
cordova plugin add org.apache.cordova.file
```


File transfer:
```bash
cordova plugin add org.apache.cordova.file-transfer
```
Geolocation:
```bash
cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-geolocation.git
```


### 2. Install Ionic

Make sure the `ionic` utility is installed:

```bash
sudo npm install -g ionic
```

### 3. Install dependencies and add the Android platform

```bash
bower install
```

### 4. Add Phonegap Facebook plugin

#### IOS
```bash
ionic platform add ios
```

```bash
cordova plugin add https://github.com/Wizcorp/phonegap-facebook-plugin.git --variable APP_ID="738982816123885" --variable APP_NAME="Splash"
```

#### Android
```bash
ionic platform add android
```

##### Build and deploy

The folks over [here](https://github.com/Wizcorp/phonegap-facebook-plugin/blob/develop/platforms/android/README.md) wrote this
life saver of a command line process that saved my day. So whatever goes forward is a repetition but specific to this project.

```bash
cordova -d plugin add https://github.com/phonegap/phonegap-facebook-plugin.git --variable APP_ID="738982816123885" --variable APP_NAME="Splash"
```
```bash
android update project --subprojects --path "platforms/android" --target android-19 --library "CordovaLib"
```
```bash
android update project --subprojects --path "platforms/android" --target android-19 --library "com.phonegap.plugins.facebookconnect/splash-FacebookLib"
```
```bash
android update project --path "platforms/android/com.phonegap.plugins.facebookconnect/splash-FacebookLib" --target android-19
```
```bash
cd platforms/android/
```
```bash
ant clean
```
```bash
cd com.phonegap.plugins.facebookconnect/splash-FacebookLib
```
```bash
ant clean
```
```bash
vim AndroidManifest.xml  (\<uses-sdk android:minSdkVersion="14" android:targetSdkVersion="17" /\>)
```
```bash
mkdir ant-build
```
```bash
ant release
```
```bash
cd ../../../.. (this should bring you back to the project root)
```

##### Keyhash

I used following steps to generate a Key Hash for my app in facebook: (I am using Mac OSX 10.8)

First open a terminal (open a command prompt in windows).
Navigate in the terminal to the directory where your Android debug.keystore is stored.
Mostly it will located under “/Users/user_name/.android/” (In Windows will be C:\Documents and Settings\.android).
Once you are in the “.android” directory, run the following command.

```bash
keytool -exportcert -alias androiddebugkey -keystore debug.keystore | openssl sha1 -binary | openssl base64
```
When it prompts you for a password, type android and hit Enter

Copy the value printed in the terminal that ends with an “=” and paste it in the Key Hash field in Facebook.
Then click the Save Changes button.



### 5. Run/emulate Soyloco-frontend

Now we are ready to build and run/emulate Soyloco-frontend
Ionic apps are based on Cordova, so we can use the Cordova utilities
to build, test, and deploy our apps, but Ionic provides simple ways to do
the same with the ionic utility (substitute android for ios to build for ios):

```bash
ionic build android
ionic run android
```

More info on this can be found on the Ionic [Getting Started](http://ionicframework.com/getting-started) page.


### 6. Using Sass

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