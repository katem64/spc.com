# SPC Online - Web Directory

This is the Capacitor web directory containing your fully offline prayer app.

## 🚀 Quick Start

### Test Locally
```bash
npx http-server -p 8080
```
Open browser: `http://localhost:8080`

**Access Code**: `SPC2025`

### Deploy to Capacitor
From project root:
```bash
npx cap sync
npx cap open android  # or ios
```

## 📁 Structure

- **index.html** - Access code screen (entry point)
- **landing.html** - Main dashboard after login
- **navbar.html** - Navigation menu (loaded dynamically)
- **footer.html** - Footer (loaded dynamically)
- **manifest.json** - PWA/Capacitor manifest
- **sw.js** - Service worker for offline support
- **/css** - All stylesheets
- **/js** - All JavaScript including access-code.js
- **/assets** - Images, fonts, vendor libraries
- **/pages** - All 75 prayer HTML files

## 🔑 Access Code

Default: `SPC2025`

To change: Edit `js/access-code.js` line 7

To logout: Console → `spcLogout()`

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

## 📱 Mobile Ready

This folder is ready for Capacitor deployment to:
- Android
- iOS

All paths are relative and work offline.

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
