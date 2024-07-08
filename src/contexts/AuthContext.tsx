"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import cookie from "js-cookie";
import { Tokens } from "../types/token";
import toast from "react-hot-toast";
import { useRouter, usePathname } from 'next/navigation';
export type UserData = {
  id: string;
  username: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

type AuthContextType = {
  userData: UserData | null;
  setUserData: (userData: UserData | null) => void;
  login: (username: string, password: string) => void;
  logout: () => void;
  errorMessage: string | null;
  setErrorMessage: (errorMessage: string) => void;
  isError: boolean;
  setIsError: (isError: boolean) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

const AuthContext = createContext<AuthContextType>({
  userData: null,
  setUserData: () => {},
  login: () => {},
  logout: () => {},
  errorMessage: null,
  setErrorMessage: () => {},
  isError: false,
  setIsError: () => {},
  isLoading: false,
  setIsLoading: () => {},
});

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  let apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter()
  const pathname = usePathname()
  const getDataUserLogin = async (token: string) => {
    try {
      const response = await fetch(`${apiUrl}/me`, {
        method: "GET",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const dataRaw = await response.json();
      const data = dataRaw.payload;

      if (dataRaw.status_code === 200) {
        setUserData(data);
        setIsLoading(false);
      } else {
        setErrorMessage(dataRaw.message);
        cookie.remove("token");
        setUserData(null);
        toast.error("Credential habis, login kembali!");
        setIsLoading(false);
      }
    } catch (error) {
      setErrorMessage(`${error}`);
    }
  };

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    const res = await fetch(`${apiUrl}/login`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (data.status_code === 200) {
      cookie.set("token", JSON.stringify(data));
      getDataUserLogin(data.payload.access_token);
      setIsLoading(false);
      toast.success("Login Berhasil!");
      router.push("/admin/default")
    } else {
      setIsError(true);
      toast.error("Login Gagal");
      setIsLoading(false);
      setTimeout(() => {
        setIsError(false);
        setErrorMessage(null);
      }, 3000);
    }
    setIsLoading(false);
  };

  const logout = () => {
    cookie.remove("token");
    setUserData(null);
    router.push("/auth/sign-in")
    toast.success("Berhasil Keluar!");
  };

  useEffect(() => {
    setIsError(false);
    setErrorMessage(null);
    const loginData = cookie.get("token");
    const tokenData: Tokens = JSON.parse(loginData || "{}");

    if (!tokenData.payload?.access_token && pathname !== "/auth/sign-in") {
      router.replace("/auth/sign-in");
    } else if (tokenData.payload?.access_token) {
      getDataUserLogin(tokenData.payload.access_token);

      if (pathname === "/auth/sign-in") {
        router.replace("/admin/default");
      }
    }
  }, [pathname]);
  return (
    <AuthContext.Provider
      value={{
        userData,
        setUserData,
        login,
        logout,
        errorMessage,
        setErrorMessage,
        isError,
        setIsError,
        isLoading,
        setIsLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
