import axios from "axios";

const sendRequest = async (requestInfo, data) => {
    console.log('requestInfo: ', requestInfo);
    switch(requestInfo.METHOD) {
        case 'GET': return  handleResponse(await axios({
            method: 'GET',
            url: requestInfo.PATH,
            headers: { 'Content-Type': 'application/json', 'X-Requested-With':'XMLHttpRequest', 'Access-Control-Allow-Origin': '*' },
            data: data
          }).catch(err => {
            console.log('ERROR', err);
            return handleResponse();
          }))
          case 'POST': return  handleResponse(await axios({
            method: 'POST',
            url: requestInfo.PATH,
            headers: { 'Content-Type': 'application/json', 'X-Requested-With':'XMLHttpRequest', 'Access-Control-Allow-Origin': '*' },
            data: data
          }).catch(err => {
            console.log('ERROR', err);
            return handleResponse();
          }))
          case 'PUT': return  handleResponse(await axios({
            method: 'PUT',
            url: requestInfo.PATH,
            headers: { 'Content-Type': 'application/json', 'X-Requested-With':'XMLHttpRequest', 'Access-Control-Allow-Origin': '*' },
            data: data
          }).catch(err => {
            console.log('ERROR', err);
            return handleResponse();
          }))
          case 'DELETE': return  handleResponse(await axios({
            method: 'DELETE',
            url: requestInfo.PATH,
            headers: { 'Content-Type': 'application/json', 'X-Requested-With':'XMLHttpRequest', 'Access-Control-Allow-Origin': '*' },
            data: data
          }).catch(err => {
            console.log('ERROR', err);
            return handleResponse();
          }))
    }
}

const handleResponse = (response) => {
    console.log(response);
    let data = {'status':'ERROR', 'message': 'Unable to process request!'};
    if(response?.status===200 && response.data){
      data = response.data;
    }
    return Promise.resolve(data)
}

export default sendRequest;