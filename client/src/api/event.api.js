import api from "./axios";

export const getEvents = () => api.get("/events");

export const getEventById = (id) => api.get(`/events/${id}`);

export const registerIn = (eventId) =>
    api.post(`/registrations/${eventId}/in`);

export const registerOut = (eventId) =>
    api.delete(`/registrations/${eventId}/out`);

export const updateJoiningLink = (eventId, link) =>
    api.put(`/events/${eventId}/link`, { link });

export const markPresent = (eventId, userId) =>
    api.put(`/attendance/${eventId}/mark`, { userId });
