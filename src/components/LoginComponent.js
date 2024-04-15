import { useContext, useEffect, useState } from "react"
import { Navigate, useNavigate } from "react-router";
import LoginService from "../service/LoginService";
import ResponseHandler from "./ResponseHandler";
import { AlertContext } from './UserContext';
/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
export  function LoginComponent() {

  const {setToastContent} = useContext(AlertContext)
  const navigate = useNavigate()
  const [login, setLogin] = useState({})
  useEffect(() => {
    if(localStorage.getItem('isLoggedIn') && localStorage.getItem('user')){
        navigate("/products");
    }
  },[]);
  const handleLogin = async () => {
    console.log('Login Details for login: ', login);
    if(login === undefined || login ==null || !login) {
      setToastContent({type:'error', message:'Please enter valid details...'})
    } else if(!login.email || login.email ===undefined || login.email === '') {
      setToastContent({type:'error', message:'Please enter valid email'})
    } else if(!login.password || login.password ===undefined || login.password === '') {
      setToastContent({type:'error', message:'Please enter valid password'})
    } else  {
      const response = await LoginService().doLogin(login);
      console.log('reponse login: ', response)
      ResponseHandler().handle(response, (success) => {
        localStorage.setItem("user", JSON.stringify(login));
        localStorage.setItem("isLoggedIn",true);
        window.location.reload();
      }, (err) => {
        console.log('error:', err)
        setToastContent({type:'error', message:err})
      })
    }
    
  }
    return (
      <>
        {/*
          This example requires updating your template:
  
          ```
          <html class="h-full bg-white">
          <body class="h-full  bg-[url('./background-img1.jpg')]">
          ```
        */}
        
        <div className="flex  min-h-full border-1 border-slate-500 flex-1 flex-col justify-center px-6 py-12 lg:px-8  bg-no-repeat bg-cover h-full">
          <div className="font-extrabold" ></div>
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="mx-auto h-10 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt="Your Company"
            />
             <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
             Welcome Back to StyleUp
            </h2>
            <h2 className=" text-center text-sm font-normal leading-9 tracking-tight text-gray-900">
              manage your inventory here
            </h2>
          </div>
  
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" action="#" method="POST">
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-sm border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={login.email}
                    onChange = {(event) => {setLogin({...login, email:event.target.value})}}
                  />
                </div>
              </div>
  
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                  </label>
                 {/*  <div className="text-sm">
                    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                      Forgot password?
                    </a>
                  </div> */}
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-sm border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={login.password}
                    onChange = {(event) => {setLogin({...login, password:event.target.value})}}
                  />
                </div>
              </div>
  
              <div>
                <button
                  type="button"
                  className="flex w-full justify-center rounded-sm bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={handleLogin}
               >
                  Login
                </button>
              </div>
            </form>
  
           {/*  <p className="mt-10 text-center text-sm text-gray-500">
              Not a member?{' '}
              <a href="#" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                Start a 14 day free trial
              </a>
            </p> */}
          </div>
        </div>
      </>
    )
  }
  
