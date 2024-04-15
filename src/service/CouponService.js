import axios from "axios";

const COUPON_API = 'https://w3d1szbsy8.execute-api.us-east-1.amazonaws.com/Staging1/coupon-api'
const CouponService = () => {

    async function retrieveCoupon(coupon_code) {
        let response = {status:'ERROR', message: 'unable to get coupon'}
            await axios.get(`${COUPON_API}?coupon_id=${coupon_code}`,/* {
                headers: { 'Content-Type': 'application/json', 'X-Requested-With':'XMLHttpRequest', 'Access-Control-Allow-Origin': '*' },
            } */).then(resp => {
                console.log('response: ', resp);
                if(resp.status===200){
                    response = {'status':'SUCCESS', data: resp.data}
                } else {
                    response = {'status':'ERROR', message: response?.data && response.data?.error ? response.data.error : 'Coupon Not Found'}
                }
            }).catch(err => {
                console.log('err', err);
            })
            return response;
    }
    async function createCoupon(data) {
        let response = {status:'ERROR', message: 'unable to save coupon'}
            await axios.post(`${COUPON_API}`, data,/* {
                headers: { 'Content-Type': 'application/json', 'X-Requested-With':'XMLHttpRequest', 'Access-Control-Allow-Origin': '*' },
            } */).then(resp => {
                console.log('response: ', resp);
                if(resp.status===200){
                    response = {'status':'SUCCESS', data: resp.data}
                } else {
                    response = {'status':'ERROR', message: response?.data && response.data?.error ? response.data.error : 'Invalid Coupon Details'}
                }
            }).catch(err => {
                console.log('err', err);
            })
            return response;
    }
    return Object.freeze({
        retrieveCoupon,
        createCoupon,
    })
}
export default CouponService;