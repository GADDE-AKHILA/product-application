/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/aspect-ratio'),
    ],
  }
  ```
*/
import 'react-toastify/dist/ReactToastify.css';
import { MdOutlineDeleteForever } from "react-icons/md";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useContext, useEffect, useState } from "react";
import { ProductQuickView } from "./ProductQucikView";
import { Link, useNavigate } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/20/solid";
import Barcode from 'react-barcode';
import ProductService from "../service/ProductsService";
import CreateProductModal from "../components/CreateProductModal"
import { render } from "react-dom";
import  ResponseHandler  from "./ResponseHandler";
import { toast } from "react-toastify";
import { AlertContext } from './UserContext';
import {CouponDialog} from './CouponDialog';

const productsList = [
  {
    quantity_sold: 10.0,
    quantity_available: 120.0,
    product_name: "Dettol Hand Wash",
    expiry_date: "2025-04-01",
    pack_size: 1.0,
    product_id: "PROD7221",
    barcode:"12345062901",
    color: 'back and gray',
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-02.jpg",
  },
  {
    quantity_sold: 10.0,
    quantity_available: 120.0,
    product_name: "Dettol Hand Wash",
    expiry_date: "2025-04-01",
    pack_size: 1.0,
    product_id: "PROD5251",
    color: 'back and gray',
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-02.jpg",
    barcode:"12345062901"
  },
  {
    quantity_sold: 10.0,
    quantity_available: 120.0,
    product_name: "Dettol Hand Wash",
    expiry_date: "2025-04-01",
    pack_size: 1.0,
    product_id: "PROD5022",
    barcode:"12345062901",
    color: 'back and gray',
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-02.jpg",
  },
  {
    quantity_sold: 10.0,
    quantity_available: 120.0,
    product_name: "Dettol Hand Wash",
    expiry_date: "2025-04-01",
    pack_size: 1.0,
    product_id: "PROD5022",
    barcode:"12345062901",
    color: 'back and gray',
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-02.jpg",
  },
  {
    quantity_sold: 10.0,
    quantity_available: 120.0,
    product_name: "Dettol Hand Wash",
    expiry_date: "2025-04-01",
    pack_size: 1.0,
    product_id: "PROD5022",
    barcode:"12345062901",
    color: 'back and gray',
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-02.jpg",
  },
  {
    quantity_sold: 10.0,
    quantity_available: 120.0,
    product_name: "Dettol Hand Wash",
    expiry_date: "2025-04-01",
    pack_size: 1.0,
    product_id: "PROD5022",
    barcode:"12345062901",
    color: 'back and gray',
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-02.jpg",
  },
  {
    quantity_sold: 10.0,
    quantity_available: 120.0,
    product_name: "Dettol Hand Wash",
    expiry_date: "2025-04-01",
    pack_size: 1.0,
    product_id: "PROD5022",
    barcode:"12345062901",
    color: 'back and gray',
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-02.jpg",
  },
  // More products...
];

export default function ListComponent() {
  const {setToastContent} = useContext(AlertContext)
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState()
  const [products, setProducts] = useState([]);
  const [showCouponDialog, setShowCouponDialog] = useState(false);
  const navigate = useNavigate();
  const [reload, setReload] = useState(false)
  useEffect(() => {
    getAllProducts();
  },[reload]);

  const getAllProducts = async() => {
    const response = await ProductService().getAllProducts();
    console.log('response in listscreen: ', response)

    ResponseHandler().handle(response,(success) =>  {
      setToastContent({'type':'success', message:'retrived products successfully'})
      setProducts(success);
    }, (error) =>{alert(error)})
  }

  const handleProductClick = (productId) => {
    console.log(productId);
    setShowModal(true);
  };
  const handleDeleteClick = async (product_id) => {
    console.log("delete product: ", product_id);
    const response = await ProductService().deleteProduct(product_id);
    ResponseHandler().handle(response,  (success)=> {
      // alert(JSON.stringify(success))
      setReload(true)
      setToastContent({'type':'success', message:'Product removed successfully'})
      
      // window.location.reload()
    }, err => setToastContent({'type':'error', message:'Unable to remove product'}));
  };
  const handleEditClick = (product) => {
    console.log("edit product: ", product);
    
    navigate(`/products/update`, { state: { show:'true', product: product } , replace:true});
  //  setShowModal(true)
  //  setSelectedProduct(product)
  };

  return (
    <div className="bg-white relative  p-10  shadow-md">
      {/* <CreateProductModal product={selectedProduct} setToastContent={setToastContent} show={showModal} title={`Update Product- ${selectedProduct?.product_id}`}/> */}
      <div className="mx-auto max-w-2xl px-4 sm:px-6 max-h-full lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Total Products
        </h2>
        <div className="mt-8  flex-row">
          <div className="flow-root">
            <ul role="list" className="-my-6  ">
              {products.map((product) => (
                <li
                  key={product.product_id}
                  className="flex py-6 hover:bg-slate-100 rounded-md"
                >
                  <div className="h-24 w-24 ml-3 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 ">
                    <img
                      src={product.image_src}
                      alt={product.imageAlt}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>
                          <a href={product.href}>{product.product_name}</a>
                        </h3>
                        <p className="ml-4 mr-3">${product.price}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {product.color}
                      </p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <p className="text-gray-500">
                        Qty {product.quantity_available}
                      </p>
                      <div className="flex flex-row items-center justify-between">
                        <Barcode
                          width="2"
                          height="32"
                          value={product.barcode}
                          className="p-3 rounded-lg hover:bg-slate-300"
                        />
                            <CouponDialog key={product.coupon_code}
                              couponCode={product.coupon_code}
                              productId={product.product_id}
                            />
                      </div>
                      <div className="flex mr-3">
                        <button
                          type="button"
                          className="font-medium text-indigo-600 hover:text-white p-3 rounded-lg hover:bg-indigo-300 "
                          onClick={() => handleEditClick({...product, isCouponBased: product.coupon_code? true : false})}
                        >
                          Update
                        </button>
                        <button
                          type="button"
                          className="font-medium text-red-600 hover:text-white hover:bg-red-300 p-3 rounded-lg"
                          onClick={() => handleDeleteClick(product.product_id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
