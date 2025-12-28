import api from "./axios";

export const getMemberDashboard = () =>
    api.get("/dashboard/member");

export const getAsstAdminDashboard = () =>
    api.get("/dashboard/asst-admin");

export const getAdminDashboard = () =>
    api.get("/dashboard/admin");
