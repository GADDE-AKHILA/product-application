import sendRequest from "../axios"

const BARCODE_API_URI = ''
const BarcodeService = () => {

    function generateBarcode(data) {
        return sendRequest({METHOD:'GET', PATH:BARCODE_API_URI}, data)
    }

    return Object.freeze({
        generateBarcode
    })
}
export default BarcodeService;