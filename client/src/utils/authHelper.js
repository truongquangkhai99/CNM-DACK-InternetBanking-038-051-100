import jwt_decode from "jwt-decode";
import { getCookie, setCookie, removeCookie } from "tiny-cookie";

export const checkAuth = () => {
  const accessToken = getCookie("access_token");
  if (!accessToken) return false;
  const { exp } = jwt_decode(accessToken);
  if (!exp) return false;
  if (Date.now() <= exp * 1000) return true;
  // session expired
  removeCookie("access_token");
  removeCookie("refresh_token");
  removeCookie("user");
  return false;
};

export const getUserEntity = () => {
  return (getCookie("user") && JSON.parse(getCookie("user"))) || "";
};

export const getUserInfo = info => {
  return (
    (checkAuth() && getUserEntity() !== "" && getUserEntity()[info]) || null
  );
};

export const signIn = (accessToken, refreshToken, cb) => {
  const { exp, user } = jwt_decode(accessToken);
  if (!exp || Date.now() <= exp) return false;
  const expires = new Date(exp * 1000);
  accessToken && setCookie("access_token", accessToken, { expires });
  refreshToken && setCookie("refresh_token", refreshToken, { expires });
  user && setCookie("user", JSON.stringify(user), { expires });
  cb && cb();
};

export const signOut = cb => {
  removeCookie("access_token");
  removeCookie("refresh_token");
  removeCookie("user");
  cb && cb();
};
