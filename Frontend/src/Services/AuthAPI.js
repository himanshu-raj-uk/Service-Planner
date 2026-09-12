import axiosInstance from "./axiosInstance";

// --------------------------------------------------User Interface------------------------------

export const registerUser = (data) => {
  return axiosInstance.post("/user/register", data);
};

export const loginUser = (data) => {
  return axiosInstance.post("/user/login", data);
};

export const verifyOTP = ({ otp, token }) => {
  return axiosInstance.post(
    "/user/verify-otp",
    { otp },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const resendOTP = (token) => {
  return axiosInstance.post(
    "/user/resend-otp",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const getUserProfile = () => {
  return axiosInstance.get("/user/profile");
};

export const getUserDashboard = async () => {
  const response = await axiosInstance.get("/user/dashboard");

  return response.data;
};

export const updateUserProfile = (formData) => {
  return axiosInstance.put("/user/profile", formData);
};

export const forgotPassword = (email) => {
  return axiosInstance.post("/user/forgot-password", {
    email,
  });
};

export const changePassword = (currentPassword, newPassword) => {
  return axiosInstance.put("/user/change-password", {
    currentPassword,
    newPassword,
  });
};

export const resetPassword = (password, resetToken) => {
  return axiosInstance.post(
    "/user/reset-password",
    { password },
    {
      headers: {
        Authorization: `Bearer ${resetToken}`,
      },
    },
  );
};

export const logoutUser = () => {
  return axiosInstance.post("/user/logout");
};

// --------------------------------------------------Create Tour plan-----------------------------------

export const createTour = (data) => {
  return axiosInstance.post("/tour/create", data);
};

export const getTripById = async (tripId) => {
  const response = await axiosInstance.get("/user/getTripById", {
    params: {
      tripId,
    },
  });

  return response.data;
};

export const confirmTrip = async (tripId) => {
  return axiosInstance.patch(`/user/trip/${tripId}/confirm`);
};

export const cancelTrip = async (tripId) => {
  return axiosInstance.patch(`/user/trip/${tripId}/cancel`);
};

// --------------------------------------------------Create Birthday plan-----------------------------------

export const createBirthday = (data) => {
  return axiosInstance.post("/birthday/create", data);
};

export const getBirthdayById = async (birthdayId) => {
  const response = await axiosInstance.get("/user/getBirthdayById", {
    params: {
      birthdayId,
    },
  });

  return response.data;
};

export const confirmBirthday = async (birthdayId) => {
  return axiosInstance.patch(`/user/birthday/${birthdayId}/confirm`);
};

export const cancelBirthday = async (birthdayId) => {
  return axiosInstance.patch(`/user/birthday/${birthdayId}/cancel`);
};

// --------------------------------------------------Notification-----------------------------------

export const getNotifications = async () => {
  const response = await axiosInstance.get("/user/notification");

  return response.data;
};

export const getUnreadNotification = async () => {
  const response = await axiosInstance.get("/user/unread-notification");

  return response.data;
};

export const deleteNotification = async (notificationId) => {
  const response = await axiosInstance.delete(
    `/user/notification/${notificationId}`,
  );

  return response.data;
};

export const deleteAllNotifications = async () => {
  const response = await axiosInstance.delete("/user/notification");

  return response.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await axiosInstance.patch("/user/notification/read-all");
  return response.data;
};

// --------------------------------------------------Support Desk-----------------------------------

export const createSupportRequest = async (data) => {
  const response = await axiosInstance.post("/user/support/create", data);

  return response.data;
};

export const getMySupportRequests = async () => {
  const response = await axiosInstance.get("/user/support/my-requests");

  return response.data;
};

export const getSupportRequestById = async (supportId) => {
  const response = await axiosInstance.get(`/user/support/${supportId}`);

  return response.data;
};
