import axios from "axios";

// Constants
const key = import.meta.env.VITE_PINATA_API_KEY;
const secret = import.meta.env.VITE_PINATA_API_SECRET;

export const uploadJSONToIPFS = async (JSONBody) => {
  console.log("uploadJSONToIPFS called with:", JSONBody);
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

  // Checking for keys
  if (!key || !secret) {
    console.error("Pinata API Keys are missing from environment!");
    return {
      success: false,
      status: "😢 Pinata API Keys are missing! Check your .env file.",
    };
  }

  console.log("JSON upload started...", JSONBody);
  return axios
    .post(url, JSONBody, {
      headers: {
        pinata_api_key: key,
        pinata_secret_api_key: secret,
      },
    })
    .then((response) => {
      return {
        success: true,
        pinataURL: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash,
      };
    })
    .catch((error) => {
      console.log(error);
      return {
        success: false,
        message: error.message,
      };
    });
};


export const uploadFileToIPFS = async (file) => {
  console.log("uploadFileToIPFS called with file:", file?.name);
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  
  // Checking for keys
  if (!key || !secret) {
    console.error("Pinata API Keys are missing from environment!");
    return {
      success: false,
      status: "😢 Pinata API Keys are missing! Check your .env file.",
    };
  }

  let data = new FormData();
  data.append("file", file);

  const metadata = JSON.stringify({
    name: "testname",
    keyvalues: {
      exampleKey: "exampleValue",
    },
  });
  data.append("pinataMetadata", metadata);

  const pinataOptions = JSON.stringify({
    cidVersion: 0,
  });
  data.append("pinataOptions", pinataOptions);

  console.log("File upload started... Keys present:", !!key, !!secret);
  return axios
    .post(url, data, {
      maxBodyLength: "Infinity",
      headers: {
        pinata_api_key: key,
        pinata_secret_api_key: secret,
      },
    })
    .then((response) => {
      console.log("image uploaded", response.data.IpfsHash);
      return {
        success: true,
        pinataURL: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash,
      };
    })
    .catch((error) => {
      console.log(error);
      return {
        success: false,
        message: error.message,
      };
    });
};
