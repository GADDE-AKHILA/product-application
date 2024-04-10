import React, { useContext, useEffect } from 'react'
import { AlertContext } from './UserContext';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
const Wrapper = ({children}) => {
    const { toastContent, setToastContent} = useContext(AlertContext);
    useEffect(() => {
        console.log('toastcontent: ', toastContent)
        switch(toastContent?.type) {
            case 'success':
                toast.success(toastContent.message);
                break;
            case 'info':
                toast.info(toastContent.message);
                break;
            case 'error':
                toast.error(toastContent.message);
                break;
            default:
                toast(toastContent.message);
        }
    },[toastContent,setToastContent])


  return (
    
    
    <React.Fragment>
        
        <ToastContainer
// position="top-right"
// autoClose={5000}
// hideProgressBar={false}
// newestOnTop={false}
// closeOnClick
// rtl={false}
// pauseOnFocusLoss
// draggable
// pauseOnHover
// theme="light"
// transition= "Bounce"
></ToastContainer>
        {children}
    </React.Fragment>
  )
}

export default Wrapper