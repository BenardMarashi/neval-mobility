// src/services/firebase.ts - COMPLETE REPLACEMENT
import { initializeApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User,
  Auth 
} from 'firebase/auth';
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
  Timestamp,
  Firestore
} from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject, 
  listAll,
  FirebaseStorage,
  uploadBytesResumable,
  UploadTaskSnapshot
} from 'firebase/storage';

// Validate environment variables
const validateConfig = () => {
  const required = [
    'REACT_APP_FIREBASE_API_KEY',
    'REACT_APP_FIREBASE_AUTH_DOMAIN',
    'REACT_APP_FIREBASE_PROJECT_ID',
    'REACT_APP_FIREBASE_STORAGE_BUCKET',
    'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
    'REACT_APP_FIREBASE_APP_ID'
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('Missing Firebase environment variables:', missing);
    console.error('Please create a .env.local file with all required variables');
    throw new Error(`Missing Firebase configuration: ${missing.join(', ')}`);
  }
};

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase with error handling
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

try {
  validateConfig();
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  // Create mock services for development without Firebase
  console.warn('Running in offline mode - Firebase features disabled');
}

// Auth functions
export const signInAdmin = async (email: string, password: string) => {
  if (!auth) throw new Error('Firebase Auth not initialized');
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Verify admin status
    const adminDoc = await getDoc(doc(db, 'admins', email));
    if (!adminDoc.exists()) {
      await signOut(auth);
      throw new Error('Not authorized as admin');
    }
    
    return userCredential.user;
  } catch (error: any) {
    console.error('Sign in error:', error);
    if (error.code === 'auth/user-not-found') {
      throw new Error('User not found');
    } else if (error.code === 'auth/wrong-password') {
      throw new Error('Invalid password');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email address');
    }
    throw error;
  }
};

export const signOutAdmin = () => {
  if (!auth) throw new Error('Firebase Auth not initialized');
  return signOut(auth);
};

// Helper to check if user is admin
export const isUserAdmin = async (user: User | null): Promise<boolean> => {
  if (!user || !user.email || !db) return false;
  
  try {
    const adminDoc = await getDoc(doc(db, 'admins', user.email));
    return adminDoc.exists();
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// Storage helper functions with progress tracking
export const uploadCarImage = async (
  carId: string, 
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ url: string; storagePath: string }> => {
  if (!storage) throw new Error('Firebase Storage not initialized');
  
  const timestamp = Date.now();
  const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const storagePath = `cars/${carId}/${fileName}`;
  const storageRef = ref(storage, storagePath);
  
  // Use resumable upload for progress tracking
  const uploadTask = uploadBytesResumable(storageRef, file);
  
  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot: UploadTaskSnapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress);
      },
      (error) => {
        console.error('Upload error:', error);
        reject(error);
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve({ url, storagePath });
      }
    );
  });
};

export const deleteCarImage = async (storagePath: string): Promise<void> => {
  if (!storage) throw new Error('Firebase Storage not initialized');
  
  try {
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
  } catch (error: any) {
    if (error.code === 'storage/object-not-found') {
      console.warn('Image already deleted:', storagePath);
    } else {
      throw error;
    }
  }
};

export const deleteAllCarImages = async (carId: string): Promise<void> => {
  if (!storage) throw new Error('Firebase Storage not initialized');
  
  try {
    const folderRef = ref(storage, `cars/${carId}`);
    const result = await listAll(folderRef);
    
    const deletePromises = result.items.map(item => deleteObject(item));
    await Promise.all(deletePromises);
  } catch (error: any) {
    if (error.code === 'storage/object-not-found') {
      console.warn('No images to delete for car:', carId);
    } else {
      throw error;
    }
  }
};

// Check if Firebase is properly initialized
export const isFirebaseInitialized = (): boolean => {
  return !!(app && auth && db && storage);
};

// Export initialized services
export { app, auth, db, storage };

// Export Firebase functions
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
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll
};