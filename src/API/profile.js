import { privateAPi } from "./privateapis";

export const updateProfile = async (payload) => {
    const res = await privateAPi.post("/cashier/updateProfile", payload, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    if (res.status === 200) {
        return res.data;
    } else {
        return res.data;
    }
};

export const changePassword = async (payload) => {
    const res = await privateAPi.post("/cashier/change-password", payload, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    if (res.status === 200) {
        return res.data;
    } else {
        return res.data;
    }
};
