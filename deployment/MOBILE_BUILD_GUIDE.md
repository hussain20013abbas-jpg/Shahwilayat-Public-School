# Mobile Build Guide: From Web to Android App (APK/AAB)

Since your app is built with React/Vite/Express, the most efficient way to convert it into a mobile app is by using **Capacitor** or **Cordova**.

## 1. Prerequisites
*   **Node.js & npm:** Already installed in your environment.
*   **Android Studio:** Download and install on your local machine.
*   **Java Development Kit (JDK):** Version 17 or later.

## 2. Step-by-Step Build Process

### Step 1: Install Capacitor
In your project root, run:
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
```

### Step 2: Initialize Capacitor
```bash
npx cap init "Shahwilayat Public School" "com.shahwilayat.app" --web-dir dist
```

### Step 3: Build Your Web App
```bash
npm run build
```

### Step 4: Add Android Platform
```bash
npx cap add android
```

### Step 5: Sync Your Code
```bash
npx cap sync
```

### Step 6: Open in Android Studio
```bash
npx cap open android
```

## 3. Generating the AAB (Android App Bundle)
1.  In Android Studio, go to **Build > Generate Signed Bundle / APK...**
2.  Select **Android App Bundle** and click **Next**.
3.  Create a new **Key Store** (keep this file safe!).
4.  Fill in the key details (alias, password, etc.).
5.  Select **release** build variant.
6.  Click **Finish**. Your `.aab` file will be generated in `android/app/release/`.

## 4. Why AAB instead of APK?
*   **Smaller Size:** Google Play generates optimized APKs for each device.
*   **Security:** Better protection for your app's code.
*   **Requirement:** Google Play now requires `.aab` for all new apps.

## 5. Low-Cost Alternatives
If you don't want to pay the $25 Google Play fee:
*   **PWA (Progressive Web App):** Users can "Add to Home Screen" directly from their browser. It feels like an app but runs on the web.
*   **Direct APK Sharing:** Build an APK and share it via Google Drive or your school's website. Users must enable "Unknown Sources" to install.
*   **Firebase App Distribution:** Great for testing with a limited number of users (up to 500) for free.
