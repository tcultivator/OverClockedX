export const orderStatusUI: Record<"success" | "pending" | "cancel" | "preparing" | "On Delivery" | '', string> = {
    success: "text-[#30B467] bg-[#A9F0AC] w-max  rounded-[10px]  flex justify-center items-center px-2 py-[2px]",
    cancel: "text-red-400 bg-red-200 w-max  rounded-[10px]  flex justify-center items-center px-2 py-[2px]",
    pending: "text-rose-500  bg-rose-200 w-max  rounded-[10px]  flex justify-center items-center px-2 py-[2px]",
    preparing: "text-blue-400  bg-blue-100 w-max  rounded-[10px]  flex justify-center items-center px-2 py-[2px]",
    "On Delivery": "text-cyan-400 bg-cyan-100 w-max  rounded-[10px]  flex justify-center items-center px-2 py-[2px]",
    '': ''
};