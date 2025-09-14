'use client';

import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: 'studio-976913498-f4e60',
  appId: '1:993589722635:web:5ced47571b307b4c00510e',
  storageBucket: 'studio-976913498-f4e60.firebasestorage.app',
  apiKey: 'AIzaSyCMuU41Jbdw-9iPO22jZKTFHW4qmkFv1BI',
  authDomain: 'studio-976913498-f4e60.firebaseapp.com',
  measurementId: '',
  messagingSenderId: '993589722635',
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
