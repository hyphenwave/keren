import axios from "axios";
import FormData from "form-data";

const PINATA_JWT = process.env.REACT_APP_PINATA_JWT;

export async function pinFileToIPFS(file, fileName) {
  const formData = new FormData();
  formData.append("file", file, fileName);

  const options = {
    headers: {
      "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
      Authorization: `Bearer ${PINATA_JWT}`,
    },
  };

  const response = await axios.post(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    formData,
    options
  );
  return response.data.IpfsHash;
}

export async function pinJSONToIPFS(jsonData, fileName) {
  const blob = new Blob([JSON.stringify(jsonData)], { type: "application/json" });
  const file = new File([blob], fileName);

  const formData = new FormData();
  formData.append("file", file);

  const options = {
    headers: {
      "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
      Authorization: `Bearer ${PINATA_JWT}`,
    },
  };

  const response = await axios.post(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    formData,
    options
  );
  return response.data.IpfsHash;
}

export function generateRandomString() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const length = 10;
  let randomString = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
}