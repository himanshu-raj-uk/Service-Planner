// Saves tokens + user info after a successful login / Google sign-in.
// Works with the backend response shape:
// { status, message, data: { user: {...}, accessToken, refreshToken } }

export const saveSession = (response, fallbackEmail = "") => {
  const body = response?.data || response || {};
  const payload = body?.data || body;

  const accessToken =
    payload?.accessToken || payload?.userToken || payload?.token || null;

  const refreshToken =
    payload?.refreshToken || payload?.userRefreshToken || null;

  if (accessToken) {
    localStorage.setItem("userToken", accessToken);
  }

  if (refreshToken) {
    localStorage.setItem("userRefreshToken", refreshToken);
  }

  const apiUser = payload?.user || payload?.profile || payload?.account || null;

  const user = {
    id: apiUser?.id || apiUser?._id || apiUser?.userId || null,
    name: apiUser?.name || apiUser?.fullName || apiUser?.username || "",
    email: apiUser?.email || fallbackEmail,
    profileImage:
      apiUser?.profileImage?.url ||
      (typeof apiUser?.profileImage === "string" ? apiUser.profileImage : "") ||
      apiUser?.avatar ||
      "",
  };

  try {
    localStorage.setItem("servicePlannerUser", JSON.stringify(user));
  } catch (storageError) {
    console.error("USER STORAGE ERROR:", storageError);
  }

  window.dispatchEvent(new CustomEvent("userLogin", { detail: { user } }));

  return { user, accessToken, refreshToken };
};