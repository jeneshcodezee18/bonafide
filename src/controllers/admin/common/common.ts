import nodemailer, {
  SendMailOptions,
  SentMessageInfo,
  Transporter,
} from "nodemailer";
import * as pagination from "pagination";
import fs from "fs";
import path from "path";
import { s3 } from "../../../app";
import {
  S3Client,
  S3ClientConfig,
  PutObjectCommand,
  PutObjectCommandOutput,
} from "@aws-sdk/client-s3";
import {
  Attachment,
  CallbackFunction,
  EmailInfo,
  SendData,
} from "../../../types/common";
// import config from "../../config.json";
export const __sendEmail = async function (
  receiver_email: string | string[],
  reply_to_email: string,
  subject: string,
  html: string,
  email_info: EmailInfo,
  attachments?: Attachment[] | null,
  bcc?: string | string[] | null
): Promise<void> {
  const transporter: Transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.googlemail.com",
    port: 465,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const sendMailOptions: SendMailOptions = {
    from: process.env.EMAIL_USER,
    to: receiver_email,
    subject,
    replyTo: reply_to_email,
    text: email_info.email_body,
    html: email_info.email_body,
  };

  if (attachments) {
    sendMailOptions.attachments = attachments;
  }

  if (bcc) {
    sendMailOptions.bcc = bcc;
  }

  if (email_info.send_blind_copy_to) {
    sendMailOptions.bcc = email_info.send_blind_copy_to;
  }

  transporter.sendMail(
    sendMailOptions,
    function (error: Error | null, info: SentMessageInfo) {
      if (error) {
        console.error("Email error:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    }
  );
};

export const addDaysToDate = function (date: Date, days: number) {
  if (!date || typeof date !== "object") return new Date();
  const d = new Date(date);
  return new Date(d.setDate(d.getDate() + days));
};

interface PaginationOptions {
  start: number;
  limit: number;
  numRows: number;
  currentRows: Array<object>; // Array of objects with dynamic keys
  type?: string;
}
export const paginationSetup = function ({
  start,
  limit,
  numRows,
  currentRows,
  type = "",
}: PaginationOptions): { list: Array<object>; html: string; text: string } {
  const paginator = new pagination.SearchPaginator({
    prelink: "/",
    current: start,
    rowsPerPage: limit,
    totalResult: numRows,
  });
  const paginationData = paginator.getPaginationData();

  let html = "";
  if (type === "") {
    if (paginationData.previous !== null) {
      html += `<li class="page-item previous"><a href="#" onclick="pagination(${paginationData.previous});" class="page-link"><i class="previous"></i></a></li>`;
    }
    for (let i = 0; i < paginationData.range.length; i++) {
      html += `<li class="page-item ${
        paginationData.current === paginationData.range[i] ? "active" : ""
      }"><a href="#" onclick="pagination(${
        paginationData.range[i]
      });" class="page-link">${paginationData.range[i]}</a></li>`;
    }
    if (paginationData.next !== null) {
      html += `<li class="page-item previous"><a href="#" onclick="pagination(${paginationData.next});" class="page-link"><i class="next"></i></a></li>`;
    }
  } else {
    if (paginationData.previous !== null) {
      html += `<li class="page-item previous"><a href="#" onclick="pagination(${paginationData.previous}, '${type}');" class="page-link"><i class="previous"></i></a></li>`;
    }
    for (let i = 0; i < paginationData.range.length; i++) {
      html += `<li class="page-item ${
        paginationData.current === paginationData.range[i] ? "active" : ""
      }"><a href="#" onclick="pagination(${
        paginationData.range[i]
      }, '${type}');" class="page-link">${paginationData.range[i]}</a></li>`;
    }
    if (paginationData.next !== null) {
      html += `<li class="page-item previous"><a href="#" onclick="pagination(${paginationData.next}, '${type}');" class="page-link"><i class="next"></i></a></li>`;
    }
  }

  let text = `Showing ${(start - 1) * limit + 1} to ${
    (start - 1) * limit + currentRows.length
  } of ${numRows} entries`;
  if (numRows === 0) {
    text = `Showing 0 to 0 of ${numRows} entries`;
  }

  return {
    list: [{}],
    html: html,
    text: text,
  };
};

// export const paginationSetup2 = function ({ start, limit, numRows, currentRows, type = '' }: PaginationOptions): { list: Array<object>, html: string, text: string } {
//     const paginator = new pagination.SearchPaginator({ prelink: '/', current: start, rowsPerPage: limit, totalResult: numRows });
//     const paginationData = paginator.getPaginationData();

//     let html = '<ul class="pagination">';

//     if (paginationData.previous !== null) {
//         html += `<li><button class="prev_btn page-link" onclick="pagination(${paginationData.previous}, '${type}')"><img src="web/assets/Images/arrow-left.svg" alt=""></button></li>`;
//     }

//     for (let i = 0; i < paginationData.range.length; i++) {
//         const isActive = paginationData.current === paginationData.range[i] ? 'active' : '';
//         html += `<li class="${isActive}"><button class="page-link" onclick="pagination(${paginationData.range[i]}, '${type}')">${paginationData.range[i]}</button></li>`;
//     }

//     if (paginationData.next !== null) {
//         html += `<li><button class="next_btn page-link" onclick="pagination(${paginationData.next}, '${type}')"><img src="web/assets/Images/arrow-right.svg" alt=""></button></li>`;
//     }

//     html += '</ul>';

//     let text = `Showing ${((start - 1) * limit) + 1} to ${((start - 1) * limit) + currentRows.length} of ${numRows} entries`;
//     if (numRows === 0) {
//         text = `Showing 0 to 0 of ${numRows} entries`;
//     }

//     return {
//         list: [{}],
//         html: html,
//         text: text
//     };
// };

// export const paginationSetup1 = function ({ start, limit, numRows, currentRows, type = '' }: PaginationOptions): { list: Array<object>, html: string, text: string } {
//     const paginator = new pagination.SearchPaginator({ prelink: '/', current: start, rowsPerPage: limit, totalResult: numRows });
//     const paginationData = paginator.getPaginationData();

//     let html = '<ul class="pagination">';

//     if (paginationData.previous !== null) {
//         html += `<li><button class="prev_btn page-link" onclick="pagination(${paginationData.previous}, '${type}')"><img src="web/assets/Images/arrow-left.svg" alt=""></button></li>`;
//     }

//     for (let i = 0; i < paginationData.range.length; i++) {
//         const isActive = paginationData.current === paginationData.range[i] ? 'active' : '';
//         html += `<li><button class="page-link ${isActive}" style="${paginationData.current === paginationData.range[i] ? 'background-color: #007bff; border-color: #007bff; color: #fff;' : 'background-color: #ffffff; border: 1px solid #ccc; color: #000; padding: 10px; margin: 5px; border-radius: 50%;'}" onclick="pagination(${paginationData.range[i]}, '${type}')">${paginationData.range[i]}</button></li>`;
//     }

//     if (paginationData.next !== null) {
//         html += `<li><button class="next_btn page-link" onclick="pagination(${paginationData.next}, '${type}')"><img src="web/assets/Images/arrow-right.svg" alt=""></button></li>`;
//     }

//     html += '</ul>';

//     let text = `Showing ${((start - 1) * limit) + 1} to ${((start - 1) * limit) + currentRows.length} of ${numRows} entries`;
//     if (numRows === 0) {
//         text = `Showing 0 to 0 of ${numRows} entries`;
//     }

//     return {
//         list: [{}],
//         html: html,
//         text: text
//     };
// };

export const paginationSetup1 = function ({
  start,
  limit,
  numRows,
  currentRows,
  type = "",
}: PaginationOptions): { list: Array<object>; html: string; text: string } {
  const paginator = new pagination.SearchPaginator({
    prelink: "/",
    current: start,
    rowsPerPage: limit,
    totalResult: numRows,
  });
  const paginationData = paginator.getPaginationData();

  let html = '<ul class="pagination">';

  if (paginationData.previous !== null) {
    html += `<li><button class="prev_btn page-link" onclick="pagination(${paginationData.previous}, '${type}')"><img src="web/assets/Images/arrow-left.svg" alt=""></button></li>`;
  }

  for (let i = 0; i < paginationData.range.length; i++) {
    // const isActive = paginationData.current === paginationData.range[i] ? 'active' : '';
    html += `<li><button class="page-link " style="${
      paginationData.current === paginationData.range[i]
        ? "background-color: #9bbccc; color: #fff; border: none;"
        : "background-color: #ffffff; border: 1px solid #ccc; color: #000; padding: 10px; margin: 5px; border-radius: 50%;"
    }" onclick="pagination(${paginationData.range[i]}, '${type}')">${
      paginationData.range[i]
    }</button></li>`;
  }

  if (paginationData.next !== null) {
    html += `<li><button class="next_btn page-link" onclick="pagination(${paginationData.next}, '${type}')"><img src="web/assets/Images/arrow-right.svg" alt=""></button></li>`;
  }

  html += "</ul>";

  let text = `Showing ${(start - 1) * limit + 1} to ${
    (start - 1) * limit + currentRows.length
  } of ${numRows} entries`;
  if (numRows === 0) {
    text = `Showing 0 to 0 of ${numRows} entries`;
  }

  return {
    list: [{}],
    html: html,
    text: text,
  };
};

export const paginationGallery = function ({
  start,
  limit,
  numRows,
  currentRows,
  type = "",
}: PaginationOptions): { list: Array<object>; html: string; text: string } {
  const paginator = new pagination.SearchPaginator({
    prelink: "/",
    current: start,
    rowsPerPage: limit,
    totalResult: numRows,
  });
  const paginationData = paginator.getPaginationData();

  let html = '<ul class="pagination">';

  if (paginationData.previous !== null) {
    html += `<li><button class="prev_btn page-link" onclick="pagination(${paginationData.previous}, '${type}')"><img src="web/assets/Images/arrow-left.svg" alt=""></button></li>`;
  }

  for (let i = 0; i < paginationData.range.length; i++) {
    // const isActive = paginationData.current === paginationData.range[i] ? 'active' : '';
    html += `<li><button class="page-link " style="${
      paginationData.current === paginationData.range[i]
        ? "background-color: #9bbccc; color: #fff; border: none;"
        : "background-color: #ffffff; border: 1px solid #ccc; color: #000; padding: 10px; margin: 5px; border-radius: 50%;"
    }" onclick="pagination(${paginationData.range[i]}, '${type}')">${
      paginationData.range[i]
    }</button></li>`;
  }

  if (paginationData.next !== null) {
    html += `<li><button class="next_btn page-link" onclick="pagination(${paginationData.next}, '${type}')"><img src="web/assets/Images/arrow-right.svg" alt=""></button></li>`;
  }

  html += "</ul>";

  let text = `Showing ${(start - 1) * limit + 1} to ${
    (start - 1) * limit + currentRows.length
  } of ${numRows} entries`;
  if (numRows === 0) {
    text = `Showing 0 to 0 of ${numRows} entries`;
  }

  return {
    list: [{}],
    html: html,
    text: text,
  };
};

export const commonController = {
  errorValidationResponse: function (data: object): SendData {
    // More specific type than `object`
    const sendData: SendData = {
      status: 406,
      err: 1,
      data,
      msg: "Please Enter All Fields",
    };
    return sendData;
  },
  getSendData: (): SendData => {
    return {
      status: 200,
      err: 0,
      data: {},
      msg: "",
    };
  },

  getSuccessSendData: (
    data: object | boolean = {},
    msg: string = ""
  ): SendData => {
    // More specific type than `object`
    return {
      status: 200,
      err: 0,
      data: data,
      msg,
    };
  },

  getErrorSendData: (
    err: any = {},
    status: number = 400,
    data: object = {},
    msg: string = ""
  ): SendData => {
    const sendData: SendData = {
      status,
      err: 1,
      data,
      msg,
    };
    if (err["code"] === 11000) {
      sendData.msg = `${Object.keys(err["keyValue"])[0]} already in use.`;
    } else {
      sendData.msg =
        err["message"] || msg || "Something went wrong, please try again later";
    }
    return sendData;
  },
};

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3ClientConfig: S3ClientConfig = {
  region,
  credentials: {
    accessKeyId: accessKeyId as string, // Ensure these are strings
    secretAccessKey: secretAccessKey as string, // Ensure these are strings
  },
};

const s3Client = new S3Client(s3ClientConfig);
export const UPLOAD_IMAGE = async function (callback: any) {
  const s3Params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${Date.now()}_image.jpg`, // Example key; could be any unique name
    Expires: 60, // Time in seconds before the URL expires
    ContentType: "image/jpeg", // Ensure this matches the file type being uploaded
    ACL: "public-read", // Set ACL according to your requirements
  };

  s3.getSignedUrl("putObject", s3Params, (err, url) => {
    if (err) {
      console.error("Error generating pre-signed URL:", err);
      return callback(err, null);
    }

    callback(null, url);
  });
};

export const UPLOAD_FILE = async function (
  data: any,
  callback: CallbackFunction
) {
  let sendData = commonController.getSendData();
  try {
    // const msg_lang = data.msg_lang || 'en';
    const file_path = data.file.path;
    const fileStream = fs.createReadStream(file_path);

    const fileName =
      data.file.filename.split(".")[0] + path.extname(data.file.originalname);

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: fileStream,
      ACL: "public-read",
    });

    const response: PutObjectCommandOutput = await s3Client.send(command);

    if (response) {
      const uploadedUrl = `https://${bucketName}.s3.amazonaws.com/${fileName}`;
      sendData = commonController.getSuccessSendData(
        { file: uploadedUrl },
        "File Has Been Successfully  Uploaded"
      );
      callback(sendData);
    } else {
      sendData = commonController.getErrorSendData(
        1,
        200,
        {},
        "File Has not Uploaded"
      );
      callback(sendData);
    }

    fs.unlinkSync(file_path);
  } catch (err: any) {
    console.log("catch err", err);
    sendData = commonController.getErrorSendData(err);
    callback(sendData);
  }
};
