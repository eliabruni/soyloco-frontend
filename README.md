Soyloco frontend
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

### 2. Add ios/android platforms
Ionic apps are based on Cordova, so we can use the Cordova utilities
to build, test, and deploy our apps, but Ionic provides simple ways to do
the same with the ionic utility (substitute ios for android to build for Android):

```bash
$ cd soyloco-frontend
$ ionic platform add ios
```

### 3. Install Cordova plugins

Before building and running or emulating the app, we need to install the
require Cordova plugins.

Basic device information:
```bash
$ cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-device.git
```

Network Connection and Battery Events:
```bash
$ cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-network-information.git
$ cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-battery-status.git
```

Accelerometer, Compass, and Geolocation:
```bash
$ cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-device-motion.git
$ cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-device-orientation.git
$ cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-geolocation.git
```

Camera, Media playback and Capture:
```bash
$ cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-camera.git
$ cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-media-capture.git
$ cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-media.git
```

Access files on device or network (File API):
```bash
$ cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-file.git
$ cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-file-transfer.git
```

Notification via dialog box or vibration:
```bash
$ cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-dialogs.git
$ cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-vibration.git
```

Contacts:
```bash
$ cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-globalization.git
```

Splashscreen:
```bash
$ cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-splashscreen.git
```

Open new browser windows (InAppBrowser):
```bash
$ cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-inappbrowser.git
```

Debug console:
```bash
$ cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-console.git
```

### 4. Run/emulate Soyloco-frontend

```bash
$ ionic build ios
$ ionic emulate ios
```

More info on this can be found on the Ionic [Getting Started](http://ionicframework.com/getting-started) page.