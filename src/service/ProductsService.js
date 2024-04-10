import sendRequest from "../axios"
const PRODUCTS_API_URL = 'https://kzcuh6r14a.execute-api.eu-west-1.amazonaws.com/test/products'

const ProductService = () => {
   
    function getAllProducts (data) {
        return sendRequest({METHOD:'GET',PATH:PRODUCTS_API_URL}, data);
    }
    function addNewProduct(data) {
        return sendRequest({METHOD:'POST', PATH:PRODUCTS_API_URL}, data);
    }
    function updateProduct(data) {
        return sendRequest({METHOD:'PUT', PATH:PRODUCTS_API_URL}, data);
    }
    function deleteProduct(product_id) {
        return sendRequest({METHOD:'DELETE', PATH:`${PRODUCTS_API_URL}/${product_id}`});
    }
    return Object.freeze({
        getAllProducts,
        addNewProduct,
        updateProduct,
        deleteProduct
    })
}

export default ProductService;