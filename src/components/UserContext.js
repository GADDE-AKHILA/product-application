import { createContext } from "react";

export const UserContext = createContext({
    userSessionDetails: {},
    isUserLoggedIn: false,
  });

  export const AlertContext=createContext({
    toastContent:{},
    setToastContent:()=>{}
  });