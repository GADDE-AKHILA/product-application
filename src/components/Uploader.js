import React from "react";
import "react-dropzone-uploader/dist/styles.css";
import Dropzone from "react-dropzone-uploader";
import axios from "axios";
import ImageService from "../service/ImageService";
import ResponseHandler from "./ResponseHandler";

const Uploader = () => {

  const API_ENDPOINT = '';
  const handleChangeStatus = ({ meta, remove }, status) => {
    console.log(status, meta);
  };

  const handleSubmit = async (files) => {
    const f = files[0];
    console.log('filllll: ',f)
    
    let url = '';
    const response =await ImageService().getPreAssignedUrl('product-api');
        ResponseHandler().handle(response,async (success) => {
            alert(JSON.stringify(success));
            console.log('s3_url full: ', success.s3_url)
            const s3Url = success.s3_url? success.s3_url.split('?')[0]: undefined;
            console.log('s3Url: ',s3Url)
            url=success.s3_url;
        }, (error) => {
            alert(error)
        })
    // PUT request: upload file to S3
    const result = await fetch(url, {
      method: "PUT",
      body: f["file"],
    });

    console.log('result::::', result)
  };

  return (
    <Dropzone
      onChangeStatus={handleChangeStatus}
      onSubmit={handleSubmit}
      maxFiles={1}
      multiple={false}
      canCancel={false}
      inputContent="Drop A File"
      styles={{
        dropzone: { width: 400, height: 200 },
        dropzoneActive: { borderColor: "green" },
      }}
    />
  );
};


export default Uploader;