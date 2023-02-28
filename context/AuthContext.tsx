import { UserType } from "@/interface";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
  User,
} from "firebase/auth";
import { useRouter } from "next/router";
import React, { createContext, ReactNode, useState, useEffect } from "react";
import { auth } from "../config/firebase";

type Props = {
  children: ReactNode;
};

type CurrentUserProps = {
  uid: string | undefined | null;
  email: string | undefined | null;
  displayName: string | undefined | null;
  address: string | undefined | null;
  phoneNumber: string | undefined | null;
};

type ContextType = {
  currentUser?: CurrentUserProps | null;
  login?: ({ email, password }: UserType) => Promise<void>;
  register?: ({ email, password }: UserType) => Promise<void>;
  logout?: () => Promise<void>;
  loading?: boolean;
  errorRegisterMessage: string;
  errorLoginMessage: string;
};

export const AuthContext = createContext<ContextType>({
  currentUser: null,
  loading: false,
  errorLoginMessage: "",
  errorRegisterMessage: "",
});

export const AuthContextProvider = ({ children }: Props) => {
  const [currentUser, setCurrentUser] = useState<CurrentUserProps | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const [isFetchingUser, setIsFetchingUser] = useState<boolean>(true)

  const [errorLoginMessage, setErrorLoginMessage] = useState<string>("");

  const [errorRegisterMessage, setErrorRegisterMessage] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          uid: user?.uid,
          email: user?.email,
          displayName: user?.displayName,
          address: "",
          phoneNumber: ""
        });
        setIsFetchingUser(false)
      }
      else{
        setIsFetchingUser(false)
      }
       
    });

    return unsubscribe;
  }, []);

  const login = async ({ email, password }: UserType) => {
    setLoading(true);
    await signInWithEmailAndPassword(auth, email, password as string)
      .then(async (userCredential) => {
        // Signed in
        const user = await userCredential.user;
        setLoading(false);

        router.push("/");
        // ...
      })
      .catch((error) => {
        setLoading(false);
        setErrorLoginMessage(error.message);
      });
  };

  const register = async ({ email, password, displayName }: UserType) => {
    setLoading(true);
    setErrorRegisterMessage("");
    await createUserWithEmailAndPassword(auth, email, password as string)
      .then(async (userCredential) => {
        const user = await userCredential.user;
      })
      .catch((error) => {
        setLoading(false);
        setErrorRegisterMessage(error.message as string);
      });
    await updateProfile(auth.currentUser as User, {
      displayName,
    }).then(() => {
      setLoading(false);
      router.push("/");
    });
  };

  const updateUser = async ({ displayName, email }:UserType) => {
    await updateProfile(auth.currentUser as User, {
      displayName,
      

    })
  }

  const logout = async () => {
    await auth.signOut();
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        register,
        logout,
        loading,
        errorRegisterMessage,
        errorLoginMessage,
      }}
    >
      {!isFetchingUser && children}
    </AuthContext.Provider>
  );
};
