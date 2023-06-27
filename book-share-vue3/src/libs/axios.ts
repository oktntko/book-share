/* eslint-disable @typescript-eslint/no-explicit-any */
import AxiosStatic, { type AxiosResponse } from "axios";

export const axios = AxiosStatic.create({ timeout: 5000 });

axios.defaults.baseURL = import.meta.env.BASE_URL;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    // responseType: "blob" でリクエストするとデータが Blob になるため、JSONにパースする
    if (error.request.responseType == "blob") {
      error.response.data = await blobToJson(error.response.data);
    }

    return Promise.reject(error);
  },
);

export async function uploadSingleFile(file: File) {
  const multipartFormData = new FormData();
  multipartFormData.append("file", file, encodeURIComponent(`${file.name}`));
  return axios.post<{ file_id: string }>("/api/files/upload/single", multipartFormData);
}

export async function uploadArrayFiles(fileList: FileList | File[]) {
  const files = Array.from(fileList);

  const multipartFormData = new FormData();
  files.forEach((file) =>
    multipartFormData.append("files", file, encodeURIComponent(`${file.name}`)),
  );
  return axios.post<{ file_id: string }[]>("/api/files/upload/array", multipartFormData);
}

export function saveAsFile(response: AxiosResponse<any>) {
  const headerFilename = response.headers["content-disposition"].split("filename=")[1];
  const filename = decodeURI(headerFilename).replace(/\+/g, " ");

  const blob = new Blob([response.data], {
    type: response.data.type,
  });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename); //or any other extension
  document.body.appendChild(link);
  link.click();

  window.URL.revokeObjectURL(url);
  document.body.removeChild(link);
}

async function blobToJson(blob: Blob): Promise<any> {
  // typeof blob => object
  const fileReader = new FileReader();
  return new Promise<string>((resolve, reject) => {
    fileReader.onerror = () => {
      fileReader.abort();
      reject();
    };

    fileReader.onload = () => {
      resolve(fileReader.result as string);
    };

    fileReader.readAsText(blob);
  })
    .then((data) => JSON.parse(data))
    .catch(console.error);
}
