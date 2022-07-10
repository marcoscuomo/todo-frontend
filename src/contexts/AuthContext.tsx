import { destroyCookie, parseCookies, setCookie } from "nookies";
import { createContext, ReactNode, useEffect, useState } from "react";
import Router from "next/router";

import { api } from "../utils/apiClient";

/** INTERFACES **/
interface User {
  name: string;
  email: string;
}

interface ILoginData {
  email: string;
  password: string;
}

interface IValueContext {
  user: User | null;
  isAuthenticated: boolean;
  signIn: ({ email, password }: ILoginData) => void;
  logout: () => void;
}

interface IPropsAuthProvider {
  children: ReactNode;
}

interface IResponseData {
  user: User;
  token: string;
  refreshToken: string;
}

interface IResponseLogin {
  data: IResponseData;
}

export const AuthContext = createContext({} as IValueContext);

export async function logout() {
  destroyCookie(undefined, "authnext-token");
  destroyCookie(undefined, "authnext-refreshToken");
  Router.push("/");
}

export function AuthProvider({ children }: IPropsAuthProvider) {
  const [user, setUser] = useState<User | null>(null);

  const isAuthenticated = !!user;

  useEffect(() => {
    const { "authnext-token": token } = parseCookies();

    if (!token) {
      Router.push("/");
    }
  }, []);

  async function signIn({ email, password }: ILoginData) {
    try {
      const {
        data: { user, token, refreshToken },
      }: IResponseLogin = await api.post("user/login", {
        email,
        password,
      });

      if (token) {
        setCookie(undefined, "authnext-token", token, {
          maxAge: 60 * 60 * 1, //1 hour
          path: "/",
        });

        setCookie(undefined, "authnext-refreshToken", refreshToken, {
          maxAge: 60 * 60 * 24 * 30, //30 days
          path: "/",
        });

        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        setUser(user);
        Router.push("/home");
      }
    } catch (error) {
      console.log("Error => ", error);
      alert("User or password incorrect");
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        signIn,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
