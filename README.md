# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.


# Scavenger Hunt Demo App 🗺️

This is a React Native app built with **Expo (Managed Workflow)** that simulates a scavenger hunt using questions and answers from a mock Postman API.

---

## 🚀 Features

- Scan QR code to fetch a question
- Answer multiple-choice questions
- Show coordinates on correct answer (Google Maps)
- Mock backend powered by Postman Mock Server


## 🧪 Mock API Setup
The mock API used in this project is defined using Postman.

📁 Located at: /mock/demoApiData.json
Steps to use:

Open Postman

Import the JSON file from mock/demoApiData.json

Create a Mock Server from the imported collection

Replace all {{url}} values with your Mock Server's base URL
