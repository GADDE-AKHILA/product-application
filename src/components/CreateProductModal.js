import React, { useContext, useEffect, useState } from 'react'

import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { ThreeDots } from 'react-loader-spinner'
import { useLocation, useNavigate } from 'react-router';
import ProductService from '../service/ProductsService';
import ResponseHandler from './ResponseHandler';
import BarcodeService from '../service/BarcodeService';
import { MdUploadFile } from 'react-icons/md';
import ImageService from '../service/ImageService';
import Uploader from './Uploader';
import { PhotoIcon } from '@heroicons/react/20/solid';
import { AlertContext } from './UserContext';
import CouponService from '../service/CouponService';
const CreateProductModal = (props) => {
    const {setToastContent} = useContext(AlertContext)
    const {state} = useLocation();
    const [productObj, setProductObj] = useState({})
    const [isLoading, setLoading] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const [coupon,setCoupon] = useState({})
    const [productImage, setProductImage] = useState()
    const [file, setFile] = useState(null);
    const [isCouponBased, setCouponBased] = useState(false);
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      setFile(file);
    };
    const navigate = useNavigate()
    const handleNewBarcode = async(event) => {
        const barcode = generateBarcode(12);
        console.log('handle new barcode', barcode);
        setProductObj({...productObj, 'barcode':barcode})

       /*  const response = await BarcodeService().generateBarcode();
        ResponseHandler().handle(response, success => {
            console.log('Generated barcode: ', success);
            setProductObj({...productObj, barcode:success})
        }, err => alert(err)); */

    }

    const generateBarcode = (length)  =>{
        let result = '';
        const characters = '0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
      }
    useEffect(() => {
        console.log('use location: ', state)
        console.log('Products in modal: ', props?.product)
        let prodObj;
        if(props?.product){
            setProductObj(props?.product)
            prodObj =  props?.product
        } else if(state?.product){
            setProductObj(state?.product)
            prodObj = state?.product
        }
        setDisabled(props.mode==='EDIT')
        if(props.mode==='EDIT' && prodObj && prodObj?.isCouponBased && prodObj?.coupon_code) {
            getCouponDetails(prodObj.coupon_code);
        }
    }, [props?.product, state?.product])

    const getCouponDetails = async(coupon_code) => {
        const response = await CouponService().retrieveCoupon(coupon_code);
        if(response) {
            if(response.status==='SUCCESS' && response.data) {
                setCoupon(response.data)
            } else {
                setCoupon(undefined)
                setToastContent({type:'error', message:'Failed to get coupon details'})
            }
        }
    }

    const handleProductSubmit = async(event) => {
        setLoading(true)
        if(props.mode==='CREATE' && (file === undefined || file==null)){
            setToastContent({'type':'error', message:`Image Required`})
            setLoading(false)
            return false;
        } 
        let response = {message: 'Unable process request'}
        let productObj1 = { 'quantity_sold':'10','expiry_date':'', ...productObj}
        if(file) {
            const s3Url = await handleImageUpload();
            console.log('sr3url for update: ', s3Url)
            productObj1['image_src']=s3Url;
            console.log('productOBJ1 ',productObj1 )
        }
        console.log('product for update:', productObj1)
        if(productObj.isCouponBased) {
            const creat = await createNewCoupon();
            console.log('created: ', creat)
            if(creat){
                console.log('in create coupon')
                setProductObj({...productObj1, coupon_code:coupon.coupon_code})
                productObj1['coupon_code'] = coupon.coupon_code;
            }else{
                setLoading(false)
                return false;
            }
        } else {
            setProductObj({...productObj1, coupon_code:undefined})
            productObj1['coupon_code'] = undefined
        }


        if(props.mode==='EDIT') {
            response =await ProductService().updateProduct(productObj1);
        } else if(props.mode === 'CREATE'){
            response = await ProductService().addNewProduct([productObj1]);
        }
        setLoading(false)
        ResponseHandler().handle(response,(success) => {
            setToastContent({'type':'success', message:`Product ${props.mode} successfully`})
            navigate('/products')
        }, (error) => {
            // alert(error)
            setToastContent({'type':'error', message:`Unable to ${props.mode} product`})
            navigate('/products')
        })
        
    }

    const handleImageUpload = async() => {
        if(!file) {
            return productObj.image_src;
        }
        console.log('filename: ', file);
        const subFolder = 'product-api';
        let response = {message: 'Unable process request'}
        let presignedurl = undefined;
        response =await ImageService().getPreAssignedUrl(subFolder);
        ResponseHandler().handle(response, (success) => {
            console.log('s3_url full: ', success.s3_url)
            presignedurl = success.s3_url;
            setToastContent({'type':'success', message:'Image Uploaded Successfully'})
        }, (error) => {
           setToastContent({'type':'error', message:error})
        })

        console.log('presignedurl: ', presignedurl)
       if(presignedurl) {
        const s3Url = presignedurl? presignedurl.split('?')[0]: undefined;
            console.log('s3Url: ',s3Url)
            if(s3Url){
                const uploadResponse =  await ImageService().uploadImage(presignedurl,file);
                console.log('UploadResponse: ',uploadResponse)
                if(uploadResponse.status==='SUCCESS') {
                    setProductObj({...productObj, image_src:s3Url})
                    return s3Url;
                } else {
                    setToastContent({'type':'error', message:uploadResponse.message})
                }
            }
       }
    }

    const handleIsCouponBased =(event) => {
        console.log('couponbased: ', event)
        setProductObj({...productObj, isCouponBased:event.target.checked})
    }

    const createNewCoupon  = async (event) => {
        const pattern = /^\d{4}-\d{2}-\d{2}$/i;
        if(!coupon || !coupon.coupon_code) {
            setToastContent({type: 'error', 'message':`Please enter couponCode`})
            return Promise.resolve(false);
        } else if(!coupon.discount_amount){
            setToastContent({type: 'error', 'message':`Please enter discount amount`})
            return Promise.resolve(false);
        } else if(!coupon.validity || !(pattern.test(coupon.validity)) || (new Date(coupon.validity)< new Date())){
            setToastContent({type: 'error', 'message':`Invalid Coupon Validity`})
            return Promise.resolve(false);
        } else if(!coupon.description) {
            setToastContent({type: 'error', 'message':`Please enter coupon description`})
            return Promise.resolve(false);
        } else {
        // setToastContent({type: 'info', 'message':`${coupon.coupon_code}`})
        let data = { "httpMethod": "POST"};
        coupon['coupon_id'] = coupon.coupon_code
        coupon['discount_type'] ="percentage"
        data['body'] = JSON.stringify(coupon)
        console.log('creating coupon : ', data)
       const response = await CouponService().createCoupon(data);
       if(response && response.status==='SUCCESS' && response.data){
            setToastContent({'type':'success', message: `coupon ${coupon.coupon_code} created successfully.`})
            return Promise.resolve(true);
        }
        console.log('save coupon response: ', response)
        setToastContent({'type':'error', message: `Failed to create coupon ${coupon.coupon_code}`})
        }
        return Promise.resolve(false);
    }

  return (
    <React.Fragment>

{/* <!-- Modal toggle --> */}

{/* <!-- Main modal --> */}
<div id="crud-modal" tab-index="-1" hidden={!props.show} aria-hidden="true" className=" overflow-y-auto overflow-x-hidden relative  justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div className="relative p-4 w-full max-w-3xl max-h-full">
        {/* <!-- Modal content --> */}
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700  w-full">
           {/*  <!-- Modal header --> */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                   {props.title} {productObj.product_id && <span 
                   className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400"
                   >{productObj.product_id}</span> }

                </h3>
      
            </div>
     
            {/* <!-- Modal body --> */}
            <form className="p-4 md:p-5 w-full">
                <div className="grid gap-4 mb-4 grid-cols-4 w-full">
                    <div className="col-span-2">
                        <label for="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                        <input type="text" name="name" id="name" 
                            value={productObj.product_name}
                            onChange={(e) => {setProductObj({...productObj, product_name:e.target.value})}}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type product name" required="" />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                        <label for="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
                        <input type="number" name="price" id="price"
                        value={productObj.price}
                        onChange={(e) => {setProductObj({...productObj, price:e.target.value})}}
                         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="$2999" required="" />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                        <label for="quantity" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Quantity</label>
                        <input type="number"
                        value={productObj.quantity_available}
                        onChange={(e) => {setProductObj({...productObj, quantity_available:e.target.value})}}
                         name="quantity" id="quantity" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="25" required="" />
                    </div>
                    <div className="relative z-0 sm:col-span-2">
                        <input type="number"  disabled={disabled}
                        value={productObj.barcode}
                        maxLength={12}
                        onChange={(e) => {setProductObj({...productObj, barcode:e.target.value})}}
                        id="floating_standard" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
                        <label for="floating_standard" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Barcode</label>
                    </div>
                    <div className='sm:col-span-2'>
                       {props.mode ==='CREATE' && <button disabled={isLoading} className="bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-800 dark:text-green-300 w-fit h-full text-center hover:dark:bg-green-900 hover:dark:text-green-200" title="new barcode" type='button'
                        onClick={handleNewBarcode}>
                        { 
                        isLoading ?
                        <ThreeDots
                        visible={true}
                        height="24"
                        width="24"
                        color="#4fa94d"
                        radius="9"
                        ariaLabel="three-dots-loading"
                        wrapperStyle={{}}
                        wrapperclassName=""
                        />
                      
                        : <React.Fragment className=' flex-row'>{/* <ArrowPathIcon height={24} width={24} /> */}<span>Generate New Barcode</span></React.Fragment> }
                        
                    </button> }
                    </div>  
                    <div className="mt-2 space-y-10 col-span-4 sm:col-span-4">
                     
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="candidates"
                      name="candidates"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    value={"checked"} checked={productObj?.isCouponBased}
                    onChange ={handleIsCouponBased}
                    
                    />
                  </div>
                  <div className="text-sm leading-6 ">
                    <label htmlFor="comments" className="font-medium text-white">
                      Add Coupon
                    </label>
                    <p className="text-gray-400">Create and assign coupon for this product.</p>
                  </div>
                </div>
                
                </div>
              { (productObj.isCouponBased) &&  <React.Fragment className='border-1 border-dashed p-3 border-slate-300'><div className="col-span-1 p-1 sm:col-span-1 ">
                        <label for="Coupon Code" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Coupon Code</label>
                        <input type="text" name="couponCode" id="couponCode"
                        value={coupon?.coupon_code} 
                        // disabled={disabled}
                        onChange={(e) => {setCoupon({...coupon, coupon_code:e.target.value})}}
                         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="NEWYEAR50" required="" />
                    </div>
                    <div className="col-span-1 sm:col-span-1 p-1">
                        <label for="Discount Amount" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Discount Amount</label>
                        <input type="number"
                        //  disabled={disabled}
                        value={coupon?.discount_amount}
                        onChange={(e) => {setCoupon({...coupon, discount_amount:e.target.value})}}
                         name="discountAmount" id="discountAmount" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="30" required="" />
                    </div> 
                    <div className="col-span-1 p-1">
                        <label for="couponExpiry" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Valid Upto</label>
                        <input type="text" name="couponExpiry" id="couponExpiry" 
                            value={coupon?.validity}
                            // disabled={disabled}
                            onChange={(e) => {setCoupon({...coupon, validity:e.target.value})}}
                            pattern="\d{4}-\d{2}-\d{2}"
                            
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="2024-06-01" required="" />
                    </div>
                    <div className="col-span-2 me-3 p-3">
                        <label for="coupondisc" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Coupon Discription</label>
                        <input type="text" name="couponDisc" id="couponDisc" 
                            value={coupon?.description}
                            // disabled={disabled}
                            onChange={(e) => {setCoupon({...coupon, description:e.target.value})}}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="New Year Sale 50%" required="" />
                    </div>
                    <div className='col-span-2'>
                      
                  {/*   <button 
                disabled={isLoading}
                    onClick={createNewCoupon}
                 type="button" 
                  className="text-white inline-flex mt-9 items-center justify-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-sm h-12 text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-full"> Create Coupon
                  </button> */}
                    </div>
                    
                    </React.Fragment>}
                <div className="col-span-full">
              <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                Product Image
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-200/25 px-6 py-10">
                <div className="text-center">
                  <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                  <div className="mt-4 flex text-sm  leading-6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-none font-semibold text-indigo-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <span>Upload a JPEG file</span>
                      <input id="file-upload"  onChange={handleFileChange} name="file-upload" type="file" className="sr-only" />
                    </label>
                    {/* <p className="pl-1 text-white">JPEG up to 5MB</p> */}
                  </div>
                  <p className="text-xs leading-5 text-white">{file?.name}</p>
                </div>
              </div>
            </div>
                  
                </div>
               
 <button 
  disabled={isLoading}
    onClick={handleProductSubmit}
    type="button"  className="text-white inline-flex  items-center justify-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-sm h-12 text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-full">
        {isLoading ? <><svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2"/>
</svg> Loading... </> :  
                   <><svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg> {props.mode==='EDIT' ? <>Update product</> : <>Add new product</> }</> }
                </button> 

            </form>
        </div>
    </div>
</div> 



    </React.Fragment>
  )
}

export default CreateProductModal