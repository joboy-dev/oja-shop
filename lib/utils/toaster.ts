import toast from "react-hot-toast";

export const toaster = {
    success: (msg: string) => toast.success(msg, {
        style: {
          color: "green",
        },
    }),
    error: (msg: string) => toast.error(msg, {
        style: {
          color: "red",
        },
    }),
    info: (msg: string) =>
      toast.error(msg, {
        style: {
          color: "red",
        },
      }),
};

export default toaster;