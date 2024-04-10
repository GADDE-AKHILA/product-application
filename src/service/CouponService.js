import sendRequest from "../axios"

const COUPON_API = 'https://w3d1szbsy8.execute-api.us-east-1.amazonaws.com/Staging1/coupon-api'
const CouponService = () => {

    function retrieveCoupon(data) {
        return sendRequest({METHOD:'GET', PATH:`${COUPON_API}?coupon_id=${data}`}, data)
    }
    function createCoupon(data) {
        return sendRequest({'METHOD':'POST', PATH:`${COUPON_API}`}, data)
    }
    return Object.freeze({
        retrieveCoupon,
        createCoupon,
    })
}
export default CouponService;