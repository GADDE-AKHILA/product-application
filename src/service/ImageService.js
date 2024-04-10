import sendRequest from "../axios"

const IMAGE_API_URL = "https://kzcuh6r14a.execute-api.eu-west-1.amazonaws.com/test/image"
const ImageService = () => {

   async function  uploadImage(url,data) {
        // return sendRequest({METHOD:'PUT', PATH:url}, data)
        const result =  await fetch(url, {
            method: "PUT",
            body: data,
          }).then(response => {
            console.log('response from upload: ', response);
            return {"status":'SUCCESS', message:'image uploaded successfully'}
          }).catch(err => {
            console.log('error: ', err);
            return {"status":'ERROR', message:"unable to upload image"}
          });
          return result;
        
    }
    function getPreAssignedUrl(data) {
        return sendRequest({METHOD:'POST', PATH:`${IMAGE_API_URL}?sub_folder=${data}`}, data)
    }
    return Object.freeze({
        uploadImage,
        getPreAssignedUrl
    })
}



export default ImageService;