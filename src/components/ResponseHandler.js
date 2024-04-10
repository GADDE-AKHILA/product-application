const ResponseHandler = (toast) => {
    function handle(response,successHandler, failureHandler){
        if(response?.status==='SUCCESS'){
            successHandler(response.data);
          } else {
            failureHandler(response?.message)
          }
    }
      return Object.freeze({
        handle
      })
}

export default ResponseHandler;