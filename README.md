Markdown
# 🔄 TouchFlip3D-Web

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![v1.0.0](https://img.shields.io/badge/version-v1.0.0-blue.svg)](https://github.com/labsisouleimen/TouchFlip3D-Web/releases)
[![jsDelivr](https://data.jsdelivr.com/v1/package/gh/labsisouleimen/TouchFlip3D-Web/badge)](https://www.jsdelivr.com/package/gh/labsisouleimen/TouchFlip3D-Web)
[![NPM Downloads](https://img.shields.io/npm/dm/touch-flip-3d-web.svg)](https://www.npmjs.com/package/touch-flip-3d-web)
[![NPM Version](https://img.shields.io/npm/v/touch-flip-3d-web.svg)](https://www.npmjs.com/package/touch-flip-3d-web)

A professional, lightweight, and high-performance **3D Touch-Flip** Web Component. Create stunning interactive cards that respond to touch gestures and mouse movements with zero dependencies.

---
<p align="center">
  <img src="https://github.com/user-attachments/assets/a8ef4713-f42b-4ae1-a37d-b32f7302c07c" width="600">
</p>

## 📸 Live Demo
Check out the interactive demo here:  
👉 [Live Demo on JSFiddle](https://jsfiddle.net/labsisouleimen/743feLta/3/)


---

## ✨ Key Features
* **🚀 Zero Dependencies:** Built with pure Vanilla JavaScript.
* **📱 Mobile Optimized:** Smooth 3D rotation with native touch events.
* **🖱️ Mouse Support:** Fully interactive with mouse dragging on desktops.
* **🔒 Encapsulated Styles:** Uses Shadow DOM to prevent CSS conflicts with your website.
* **🚫 Anti-Selection:** Automatically prevents text selection while flipping for a better UX.

---

## 📦 Installation
### 1️⃣ Option A: Using NPM (For Modern Apps)
If you are using Node.js, React, Vue, or Vite:

**Install:**
```bash
npm install touch-flip-3d-web
```
## Import in your JavaScript:
```bash

import 'touch-flip-3d-web';
```

### Using CDN (Recommended)
Add the following script to your HTML `<head>` section:

```html

<script src="[https://cdn.jsdelivr.net/gh/labsisouleimen/TouchFlip3D-Web@1.0.0/TouchFlip3D.js](https://cdn.jsdelivr.net/gh/labsisouleimen/TouchFlip3D-Web@1.0.0/TouchFlip3D.js)"></script>
```
---

## 🛠️ Quick Start
Simply use the <touch-flip-3d> tag. Use the slot="front" and slot="back" attributes to define the sides of your card.

```html
<touch-flip-3d style="width: 380px; height: 240px;">
  <div slot="front" style="background: #1e3c72; color: white; border-radius: 15px;">
      <h2>Front Card Content</h2>
  </div>

  <div slot="back" style="background: #2d3436; color: white; border-radius: 15px;">
      <h2>Back Card Content</h2>
  </div>
</touch-flip-3d>
```
---
## 📱 Looking for Android Version?
Check out the native version for Android: TouchFlip3D-Android

---

## 📜 License
This project is licensed under the **MIT License** - meaning you can freely use, modify, and distribute it, provided you give credit to the original author.

---

## 📩 Let's Connect
**Developed by Souleimen Labsi **
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=flat&logo=linkedin)](https://www.linkedin.com/in/souleimen-labsi-5937783ab/)

