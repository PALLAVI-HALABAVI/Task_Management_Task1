import axiosInstance from "./axiosInstance";

export const scheduleMeeting = (payload) =>
  axiosInstance.post('/meetings/schedule', payload);

export const getUserMeetings = () =>
  axiosInstance.get('/meetings/user');

export const getAllMeetings = () =>
  axiosInstance.get('/meetings');