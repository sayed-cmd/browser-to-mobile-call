// ==========================
// background.js
// ==========================

// Local Firebase SDK import
importScripts("libs/firebase-app-compat.js");
importScripts("libs/firebase-database-compat.js");
importScripts("libs/firebase-auth-compat.js");

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAKTNMVnl4W04_WH0PqsIA2xattjTR6x0M",
  authDomain: "call-from-browserss.firebaseapp.com",
  databaseURL: "https://call-from-browserss-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "call-from-browserss",
  storageBucket: "call-from-browserss.firebasestorage.app",
  messagingSenderId: "421459301855",
  appId: "1:421459301855:web:5f9581250da6cd3935a06a"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();

async function signInAnonymously() {
  try {
    if (!auth.currentUser) {
      const userCredential = await auth.signInAnonymously();
      const uid = userCredential.user.uid;
      console.log("Anonymous UID:", uid);
      chrome.storage.local.set({ userUID: uid });
      return uid;
    } else {
      console.log("Current UID:", auth.currentUser.uid);
      return auth.currentUser.uid;
    }
  } catch (error) {
    console.error("Anonymous sign-in failed:", error);
    return null;
  }
}

// Context Menu তৈরি
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "callFromMobile",
    title: "Call from browser",
    contexts: ["selection"]
  });
});

// Context Menu Click
chrome.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId === "callFromMobile") {
    const selectedNumber = info.selectionText.trim();
    if (!selectedNumber) return;

    const uid = await signInAnonymously();
    if (!uid) return;

    // Firebase write per user
    db.ref(`calls/${uid}`).set({
      number: selectedNumber,
      timestamp: Date.now()
    });

    console.log("Number sent to Firebase for UID:", uid, selectedNumber);
  }
});

// Popup থেকে UID চাওয়া হলে ফেরত দেওয়া
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "getUID") {
    const uid = auth.currentUser ? auth.currentUser.uid : await signInAnonymously();
    sendResponse({ uid });
  }
  return true;
});
