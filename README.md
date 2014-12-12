Ionic project using native fb authentication
============================================

A starting project for Ionic that supports authentication with native facebook integration

## Phonegap Facebook plugin
phonegap facebook plugin available at [phonegap-facebook-plugin](https://github.com/phonegap/phonegap-facebook-plugin.git)

## Why this project?

When you try to install this plugin in a normal cordova project , you will encounter a lot of build errors. Now if you manage to add this plugin successfully you will have a lot of runtime errors to deal with. At least I never got it working and so i think did many people out there.


## How to build and deploy?

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

14. ionic build android

## Facebook login

Configure your keyhash on the facebook app (step 3).




There are still bugs on the plugin for android when we remove the app from the permissions list, which already has a patch.
