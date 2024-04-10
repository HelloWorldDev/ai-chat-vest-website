import { showToast, Dialog } from "vant";
import "vant/es/toast/style";
import "vant/es/dialog/style";

//封装更改toast默认值
export const myVanToast = (options) => {
    showToast({
        type: options.type ? options.type : "text",
        message: options.message,
        duration: options.duration >= 0 ? options.duration : 2000,
        position: options.position ? options.position : "middle",
        className: options.className,
        forbidClick: true,
        wordBreak: "break-word",
    });
    return showToast;
};

export const myDialog = () => {
    Dialog.name = "my-van-dialog";
    return Dialog;
};
