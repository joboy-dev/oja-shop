import { toaster } from "./toaster";
import { AxiosError } from 'axios';

export function ProcessError(error: any, fallbackMessage = 'Something went wrong') {
  let message = fallbackMessage;

  if (typeof error === "string") {
    message = error
  } else {
    const axiosError = error as AxiosError;
    const responseData = axiosError.response?.data;
    
    if (typeof responseData === 'string') {
      message = responseData;
    } else if (typeof responseData === 'object' && responseData !== null) {
      // Support { message: "error here" } or { error: "..." }
      message =
        (responseData as any).message ||
        (responseData as any).error ||
        fallbackMessage;
    }
  }

  toaster.error(message);
}