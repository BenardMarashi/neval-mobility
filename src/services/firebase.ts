// src/services/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';

// Your Firebase config (you'll get this from Firebase Console)
// ULTRA-THINK: Store these in .env.local for security
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Auth functions
export const signInAdmin = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // ULTRA-THINK: Verify admin status
    const adminDoc = await getDoc(doc(db, 'admins', email));
    if (!adminDoc.exists()) {
      await signOut(auth);
      throw new Error('Not authorized as admin');
    }
    
    return userCredential.user;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

export const signOutAdmin = () => signOut(auth);

// Helper to check if user is admin
export const isUserAdmin = async (user: User | null): Promise<boolean> => {
  if (!user || !user.email) return false;
  
  try {
    const adminDoc = await getDoc(doc(db, 'admins', user.email));
    return adminDoc.exists();
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// Export Firebase types and functions
export { 
  onAuthStateChanged,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  type User
};