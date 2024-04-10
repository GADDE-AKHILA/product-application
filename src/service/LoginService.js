import sendRequest from "../axios";

const LOGIN_API = "https://kzcuh6r14a.execute-api.eu-west-1.amazonaws.com/test/products/admin-login"
const  LoginService = () => {
    function doLogin(data) {
        return sendRequest({METHOD:'POST',PATH:LOGIN_API}, data);
    }

    return Object.freeze({
        doLogin,
    });
}
export default LoginService;