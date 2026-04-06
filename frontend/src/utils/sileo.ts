import { sileo, type SileoPosition } from "sileo";

export const successToast = (title : string, position: SileoPosition = "top-center") => {
    sileo.success({
        title: title,
        position,
    });
}

export const errorToast = (title : string, position: SileoPosition = "top-center") => {
    sileo.error({
        title: title,
        position: position,
    });
}
export const promiseToast = <T extends { message?: string}>(
    promise: Promise<T>,
    position: SileoPosition = "top-center",
    successMessage?: string,
) => {
    return sileo.promise(promise, {
        position: position,
        loading: { title: "Loading..." },
        success: (data: T) => {
            setTimeout(() => {
                window.location.reload()
            }, 1000)
            return ({
                title: data?.message || successMessage || "Success",
            })
        },
        error: (err: any) => ({
            title: err?.message || "Something went wrong",
        }),
    });
};