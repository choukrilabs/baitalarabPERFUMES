import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc
} from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase';
import { UserProfile, Address, Order, CartItem } from '../types';

// Helper to safely strip undefined values before passing to Firestore
function cleanFirestoreData<T>(data: T): T {
  if (data === undefined) {
    return null as any;
  }
  if (data === null || typeof data !== 'object') {
    return data;
  }
  if (Array.isArray(data)) {
    return data
      .filter((item) => item !== undefined)
      .map((item) => cleanFirestoreData(item)) as any;
  }
  const cleanObj: Record<string, any> = {};
  for (const [key, value] of Object.entries(data as Record<string, any>)) {
    if (value !== undefined) {
      cleanObj[key] = cleanFirestoreData(value);
    }
  }
  return cleanObj as T;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  userOrders: Order[];
  loading: boolean;
  loginWithGoogle: () => Promise<boolean>;
  loginWithEmail: (email: string, pass: string) => Promise<boolean>;
  registerWithEmail: (email: string, pass: string, name: string, phone?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  updateUserPhone: (phone: string) => Promise<boolean>;
  updateDisplayName: (name: string) => Promise<boolean>;
  addAddress: (address: Omit<Address, 'id'>) => Promise<boolean>;
  updateAddress: (address: Address) => Promise<boolean>;
  deleteAddress: (addressId: string) => Promise<boolean>;
  setDefaultAddress: (addressId: string) => Promise<boolean>;
  saveOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'userId'>) => Promise<string | null>;
  syncFavoritesToCloud: (favorites: string[]) => Promise<void>;
  syncCartToCloud: (cart: CartItem[]) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Fetch or create profile
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists()) {
            setUserProfile(docSnap.data() as UserProfile);
          } else {
            // Initialize new user profile
            const newProfile: UserProfile = {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || 'عميل بيت العرب',
              photoURL: user.photoURL || '',
              phone: '',
              addresses: [],
              favorites: [],
              cart: [],
              createdAt: new Date().toISOString(),
            };
            await setDoc(userDocRef, cleanFirestoreData(newProfile));
            setUserProfile(newProfile);
          }
        } catch (error) {
          console.error('Error fetching/creating user profile:', error);
          // Fallback memory profile
          setUserProfile({
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || 'عميل بيت العرب',
            addresses: [],
            favorites: [],
            cart: [],
            createdAt: new Date().toISOString(),
          });
        }
      } else {
        setUserProfile(null);
        setUserOrders([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Listen to User Orders in Firestore
  useEffect(() => {
    if (!currentUser) {
      setUserOrders([]);
      return;
    }

    try {
      const ordersRef = collection(db, 'orders');
      const q = query(
        ordersRef,
        where('userId', '==', currentUser.uid)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const orders = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })) as Order[];
          // Sort client-side by createdAt descending to avoid composite index requirements
          orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setUserOrders(orders);
        },
        (err) => {
          console.warn('Orders snapshot warning (fallback mode):', err);
        }
      );

      return () => unsubscribe();
    } catch (e) {
      console.warn('Could not attach orders listener:', e);
    }
  }, [currentUser]);

  // Auth Functions
  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      await signInWithPopup(auth, googleProvider);
      return true;
    } catch (err: any) {
      console.error('Google Sign-in Error:', err);
      throw err;
    }
  };

  const loginWithEmail = async (email: string, pass: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      return true;
    } catch (err: any) {
      console.error('Email Login Error:', err);
      throw err;
    }
  };

  const registerWithEmail = async (
    email: string,
    pass: string,
    name: string,
    phone?: string
  ): Promise<boolean> => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      if (cred.user) {
        await updateProfile(cred.user, { displayName: name });
        const newProfile: UserProfile = {
          uid: cred.user.uid,
          email: cred.user.email || email,
          displayName: name,
          phone: phone || '',
          addresses: [],
          favorites: [],
          cart: [],
          createdAt: new Date().toISOString(),
        };
        await setDoc(doc(db, 'users', cred.user.uid), newProfile);
        setUserProfile(newProfile);
      }
      return true;
    } catch (err: any) {
      console.error('Registration Error:', err);
      throw err;
    }
  };

  const logout = async (): Promise<void> => {
    await signOut(auth);
    setUserProfile(null);
    setUserOrders([]);
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (err: any) {
      console.error('Password reset error:', err);
      throw err;
    }
  };

  const updateDisplayName = async (name: string): Promise<boolean> => {
    if (!currentUser) return false;
    try {
      await updateProfile(currentUser, { displayName: name });
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, { displayName: name, updatedAt: new Date().toISOString() });
      setUserProfile((prev) => (prev ? { ...prev, displayName: name } : null));
      return true;
    } catch (err) {
      console.error('Error updating name:', err);
      return false;
    }
  };

  const updateUserPhone = async (phone: string): Promise<boolean> => {
    if (!currentUser) return false;
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, { phone, updatedAt: new Date().toISOString() });
      setUserProfile((prev) => (prev ? { ...prev, phone } : null));
      return true;
    } catch (err) {
      console.error('Error updating phone:', err);
      return false;
    }
  };

  // Address operations
  const addAddress = async (addrData: Omit<Address, 'id'>): Promise<boolean> => {
    if (!currentUser || !userProfile) return false;
    try {
      const newAddress: Address = {
        id: 'addr_' + Date.now().toString(),
        title: addrData.title || 'المنزل',
        recipientName: addrData.recipientName || '',
        phone: addrData.phone || '',
        city: addrData.city || 'الدار البيضاء',
        district: addrData.district || '',
        streetAddress: addrData.streetAddress || '',
        postalCode: addrData.postalCode || '',
        deliveryNotes: addrData.deliveryNotes || '',
        isDefault: Boolean(addrData.isDefault),
      };

      let updatedAddresses = [...(userProfile.addresses || [])];
      if (newAddress.isDefault) {
        updatedAddresses = updatedAddresses.map((a) => ({ ...a, isDefault: false }));
      }
      // If it's the only address, make it default
      if (updatedAddresses.length === 0) {
        newAddress.isDefault = true;
      }
      updatedAddresses.push(newAddress);

      const userRef = doc(db, 'users', currentUser.uid);
      const cleanList = cleanFirestoreData(updatedAddresses);
      await updateDoc(userRef, { addresses: cleanList, updatedAt: new Date().toISOString() });
      setUserProfile((prev) => (prev ? { ...prev, addresses: cleanList } : null));
      return true;
    } catch (err) {
      console.error('Error adding address:', err);
      return false;
    }
  };

  const updateAddress = async (updatedAddr: Address): Promise<boolean> => {
    if (!currentUser || !userProfile) return false;
    try {
      const cleanSingleAddr: Address = {
        id: updatedAddr.id,
        title: updatedAddr.title || 'المنزل',
        recipientName: updatedAddr.recipientName || '',
        phone: updatedAddr.phone || '',
        city: updatedAddr.city || 'الدار البيضاء',
        district: updatedAddr.district || '',
        streetAddress: updatedAddr.streetAddress || '',
        postalCode: updatedAddr.postalCode || '',
        deliveryNotes: updatedAddr.deliveryNotes || '',
        isDefault: Boolean(updatedAddr.isDefault),
      };

      let updatedAddresses = (userProfile.addresses || []).map((a) => {
        if (a.id === cleanSingleAddr.id) {
          return cleanSingleAddr;
        }
        if (cleanSingleAddr.isDefault) {
          return { ...a, isDefault: false };
        }
        return a;
      });

      const userRef = doc(db, 'users', currentUser.uid);
      const cleanList = cleanFirestoreData(updatedAddresses);
      await updateDoc(userRef, { addresses: cleanList, updatedAt: new Date().toISOString() });
      setUserProfile((prev) => (prev ? { ...prev, addresses: cleanList } : null));
      return true;
    } catch (err) {
      console.error('Error updating address:', err);
      return false;
    }
  };

  const deleteAddress = async (addressId: string): Promise<boolean> => {
    if (!currentUser || !userProfile) return false;
    try {
      let updatedAddresses = (userProfile.addresses || []).filter((a) => a.id !== addressId);
      // If default was deleted and there are remaining addresses, make first default
      if (updatedAddresses.length > 0 && !updatedAddresses.some((a) => a.isDefault)) {
        updatedAddresses[0].isDefault = true;
      }

      const userRef = doc(db, 'users', currentUser.uid);
      const cleanList = cleanFirestoreData(updatedAddresses);
      await updateDoc(userRef, { addresses: cleanList, updatedAt: new Date().toISOString() });
      setUserProfile((prev) => (prev ? { ...prev, addresses: cleanList } : null));
      return true;
    } catch (err) {
      console.error('Error deleting address:', err);
      return false;
    }
  };

  const setDefaultAddress = async (addressId: string): Promise<boolean> => {
    if (!currentUser || !userProfile) return false;
    try {
      const updatedAddresses = (userProfile.addresses || []).map((a) => ({
        ...a,
        isDefault: a.id === addressId,
      }));

      const userRef = doc(db, 'users', currentUser.uid);
      const cleanList = cleanFirestoreData(updatedAddresses);
      await updateDoc(userRef, { addresses: cleanList, updatedAt: new Date().toISOString() });
      setUserProfile((prev) => (prev ? { ...prev, addresses: cleanList } : null));
      return true;
    } catch (err) {
      console.error('Error setting default address:', err);
      return false;
    }
  };

  // Orders
  const saveOrder = async (
    orderData: Omit<Order, 'id' | 'createdAt' | 'userId'>
  ): Promise<string | null> => {
    try {
      const orderPayload: Record<string, any> = {
        userId: currentUser ? currentUser.uid : 'guest',
        createdAt: new Date().toISOString(),
        status: orderData.status || 'pending',
        items: (orderData.items || []).map((item) => ({
          quantity: item.quantity,
          product: {
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            image: item.product.image || '',
            category: item.product.category || 'perfumes',
            volume: item.product.volume || '',
            description: item.product.description || '',
          },
        })),
        totalPrice: Number(orderData.totalPrice) || 0,
        customerName: orderData.customerName || currentUser?.displayName || 'العميل',
        phone: orderData.phone || userProfile?.phone || '',
      };

      if (orderData.address) {
        orderPayload.address = {
          id: orderData.address.id || 'addr_' + Date.now(),
          title: orderData.address.title || 'عنوان التوصيل',
          recipientName: orderData.address.recipientName || orderPayload.customerName,
          phone: orderData.address.phone || orderPayload.phone,
          city: orderData.address.city || 'الدار البيضاء',
          district: orderData.address.district || '',
          streetAddress: orderData.address.streetAddress || '',
          postalCode: orderData.address.postalCode || '',
          deliveryNotes: orderData.address.deliveryNotes || '',
          isDefault: Boolean(orderData.address.isDefault),
        };
      }

      const cleanOrder = cleanFirestoreData(orderPayload);
      const docRef = await addDoc(collection(db, 'orders'), cleanOrder);
      
      const createdOrder: Order = {
        id: docRef.id,
        ...cleanOrder,
      } as Order;

      // Update local state immediately if logged in
      if (currentUser) {
        setUserOrders((prev) => [createdOrder, ...prev]);
      }
      return docRef.id;
    } catch (err) {
      console.error('Error saving order:', err);
      return null;
    }
  };

  // Cloud sync for favorites and cart
  const syncFavoritesToCloud = async (favorites: string[]) => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, { favorites, updatedAt: new Date().toISOString() });
    } catch (e) {
      console.warn('Could not sync favorites to cloud:', e);
    }
  };

  const syncCartToCloud = async (cart: CartItem[]) => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, { cart, updatedAt: new Date().toISOString() });
    } catch (e) {
      console.warn('Could not sync cart to cloud:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        userOrders,
        loading,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        logout,
        resetPassword,
        updateDisplayName,
        updateUserPhone,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        saveOrder,
        syncFavoritesToCloud,
        syncCartToCloud,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
