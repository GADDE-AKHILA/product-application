import React, { Component, useContext, useEffect, useState } from "react";
import { Navigate, Route } from "react-router";
import { AlertContext, UserContext } from "./UserContext";
import Wrapper from "./Wrapper";

const SecuredRoute =({children}) => {
  const [toastContent, setToastContent] = useState([]);
    const usercontext = useContext(UserContext);
    useEffect(()=> {
        console.log('usersessions: ', usercontext)
    },[])
    return (
      <React.Fragment>
        {/* <AlertContext.Provider value={{ toastContent, setToastContent }}> */}
        {usercontext.isUserLoggedIn || usercontext.isUserLoggedIn==='true' ? 
          <>
            <main className="relative">
              <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 overflow-auto top-10">
                <Wrapper>{children}</Wrapper> 
              </div>
            </main>
          </>
         : 
          <Navigate to="/login" />
        }
        {/* </AlertContext.Provider> */}
      </React.Fragment>
    );
}
export default SecuredRoute;