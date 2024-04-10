import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import AppRoutes from "./AppRoutes";
import Dashboard from "./components/Dashboard";
import { LoginComponent } from "./components/LoginComponent";
import NavTab from "./components/NavTab";
import { AlertContext, UserContext } from "./components/UserContext";

function App() {

  const [userSessionDetails,setUserSessionDetails] = useState({});
  const [isUserLoggedIn, setUserLoggedIn] = useState(false);
  const [loaded, setLoaded] = useState(false)
  const [toastContent, setToastContent] = useState([]);
  const navigate = useNavigate()
  useEffect(() => {
    if(localStorage.getItem('isLoggedIn') && localStorage.getItem('user')){
      console.log('userLoggediN')
      setUserSessionDetails(localStorage.getItem('user'));
      setUserLoggedIn(true);
    }
    setLoaded(true);
    
  },[]);
  return (
    <>
    <div className="min-h-full h-full w-full">
    <UserContext.Provider value={{ userSessionDetails, isUserLoggedIn }}>
      <AlertContext.Provider value={{ toastContent, setToastContent }}>
        {isUserLoggedIn && <NavTab />}
          <AppRoutes />
        </AlertContext.Provider>
    </UserContext.Provider>
    </div> 
    </>
  );
}

export default App;
