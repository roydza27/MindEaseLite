# 🔥 Firebase Setup Guide for MindEase

## Step 1: Create Firebase Project

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Click "Create a project"**
3. **Enter project name**: `mindease-lite` (or your preferred name)
4. **Disable Google Analytics** (optional, for simplicity)
5. **Click "Create project"**

## Step 2: Enable Firestore Database

1. **In your Firebase project dashboard**
2. **Click "Firestore Database"** in the left sidebar
3. **Click "Create database"**
4. **Choose "Start in test mode"** (for development)
5. **Select a location** (choose closest to you)
6. **Click "Done"**

## Step 3: Get Firebase Configuration

1. **Click the gear icon** (⚙️) next to "Project Overview"
2. **Click "Project settings"**
3. **Scroll down to "Your apps" section**
4. **Click the web icon** (</>) to add a web app
5. **Enter app nickname**: `mindease-web`
6. **Check "Also set up Firebase Hosting"** (optional)
7. **Click "Register app"**
8. **Copy the Firebase configuration object**

## Step 4: Update Your App Configuration

1. **Open** `config/firebase.ts` in your project
2. **Replace the placeholder values** with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id"
};
```

## Step 5: Set Up Firestore Security Rules

1. **Go to Firestore Database** in Firebase Console
2. **Click "Rules" tab**
3. **Replace the rules** with this development-friendly version:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all documents for development
    // TODO: Implement proper security rules for production
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

4. **Click "Publish"**

## Step 6: Test Your Setup

1. **Start your app**: `npm start`
2. **Check the console** for any Firebase connection errors
3. **Try using the mood tracker** - it should now save data to Firebase!

## 🎯 What This Setup Gives You

### ✅ **Data Storage**
- **Mood entries** - All your mood tracking data
- **Timer sessions** - Your focus/block sessions
- **User settings** - Theme, language preferences
- **User profiles** - Basic user information

### ✅ **Real-time Features**
- **Live updates** - Changes sync across devices
- **Offline support** - Works without internet
- **Automatic sync** - Data syncs when connection returns

### ✅ **Easy Management**
- **Firebase Console** - View and manage your data
- **No server needed** - Firebase handles everything
- **Scalable** - Grows with your app

## 🔧 Next Steps

Once Firebase is set up, your app will automatically:
1. **Save mood entries** when you complete the mood tracker
2. **Store timer sessions** when you use BlockKit
3. **Remember your settings** across app restarts
4. **Sync data** if you use the app on multiple devices

## 🚨 Important Notes

- **Test mode** allows anyone to read/write your database
- **For production**, you'll need to implement proper security rules
- **Keep your Firebase config** secure and don't commit it to public repos
- **Monitor usage** in Firebase Console to avoid unexpected charges

## 🆘 Need Help?

If you encounter any issues:
1. **Check the console** for error messages
2. **Verify your Firebase config** is correct
3. **Make sure Firestore** is enabled in your project
4. **Check your internet connection**

Happy coding! 🚀
