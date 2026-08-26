import api from "./api";

export const googleLogin = (data) => {
    return api.post("/auth/google", data);
};

export const getCurrentUser = () => {
    return api.get("/auth/me");
};

export const logout = () => {
    return api.post("/auth/logout");
};