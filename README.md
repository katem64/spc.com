# SPC Prayer.Com

This is the `spc.com` Capacitor web directory containing the fully offline prayer app.

## 🚀 Quick Start

### Test Locally
```bash
npx http-server -p 8080
```
Open browser: `http://localhost/spc.com/`

### Deploy to Capacitor
From project root:
```bash
.\scripts\sync-capacitor-web.ps1
npx cap sync android
npx cap open android
```

### Build and Install Android APK

The app can be installed directly on Android phones without Google Play or Google Play Services.

```powershell
$env:JAVA_HOME="$env:ProgramFiles\Android\Android Studio\jbr"
Push-Location .\android
.\gradlew.bat assembleDebug
Pop-Location
```

The test APK is created at:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

Copy this APK to an Android phone and open it, or install it over USB:

```powershell
$adb="$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe"
& $adb install -r ".\android\app\build\outputs\apk\debug\app-debug.apk"
```

The debug APK is for testing. Before distributing the app broadly, create a signed release APK with a protected release keystore. A signed release APK can also be distributed directly without Google Play.

## 📁 Structure

- **index.html** - Public prayer landing screen (entry point)
- **landing.html** - Main dashboard after login
- **navbar.html** - Navigation menu (loaded dynamically)
- **footer.html** - Footer (loaded dynamically)
- **manifest.json** - PWA/Capacitor manifest
- **sw.js** - Service worker for offline support
- **/css** - All stylesheets
- **/js** - Application JavaScript
- **/assets** - Images, fonts, vendor libraries
- **/pages** - All 75 prayer HTML files
- **/data/marks-examen-index.json** - Offline M.A.R.K.S. Examen data and search index
- **/assets/images/marks-examen-cover.png** - Official M.A.R.K.S. Examen cover
- **/android** - Capacitor Android project
- **/www** - Generated web bundle used by Capacitor

## ✅ Features

- ✅ 100% offline functionality
- ✅ Sisters-only access code
- ✅ 75 prayer pages
- ✅ Beautiful modern design
- ✅ Dark mode support
- ✅ Prayer tracker
- ✅ Bookmarks
- ✅ Search
- ✅ Font size adjustment
- ✅ M.A.R.K.S. Examen search across Marks, weeks, themes, and daily prompts
- ✅ Direct Android APK installation without Google Play

## 📱 Mobile Ready

This folder is ready for Capacitor deployment to:
- Android
- iOS

All paths are relative and work offline.

The Android build has been installed and launched successfully on the configured Pixel 6 emulator. A physical Android phone should have a working Android WebView provider. Google Play Services are not required by the app.

## 🎨 Design

- Pray As You Go aesthetic
- Soft gradient backgrounds
- Smooth animations
- Enhanced dark mode
- Touch-optimized UI

## 📚 Documentation

See project root for:
- CAPACITOR-SETUP-GUIDE.md
- QUICKSTART-5MIN.md
- FINAL-SUMMARY.md

---

**Ready to build your mobile app!** 🙏
