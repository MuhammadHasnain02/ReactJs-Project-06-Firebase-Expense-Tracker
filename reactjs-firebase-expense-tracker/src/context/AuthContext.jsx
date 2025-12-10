import { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider } from '../firebase/config'
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";

const AuthContext = createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {

    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    function signup(email , password) {
        return createUserWithEmailAndPassword(auth , email , password)
    }
    function login(email, password) {
        return signInWithEmailAndPassword(auth , email , password)
    }
    function logout() {
        return signOut(auth)
    }

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            console.log("Google User Info:", user);
            alert(`Welcome ${user.displayName}`);
        }
        catch (error) {
            console.error("Google Sign-In Error:", error.message);
        }
    };

    useEffect(() => {

        const unsubscribe = onAuthStateChanged(auth , (user) => {
            setCurrentUser(user);
            setLoading(false)
        }, [])

        return unsubscribe
    })

    const value = {
        currentUser,
        signup,
        login,
        logout,
        signInWithGoogle
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )

}