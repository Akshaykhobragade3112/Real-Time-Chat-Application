import { jwtDecode } from "jwt-decode";

export function getAccessToken() {
  return localStorage.getItem("access");
}

export function getRefreshToken() {
  return localStorage.getItem("refresh");
}

export function saveTokens({ access, refresh }) {
  localStorage.setItem("access", access);
  localStorage.setItem("refresh", refresh);
}

export function clearTokens() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
}

export function getUserId() {
  const token = getAccessToken();
  if (!token) return null;
  try {
    const decoded = jwtDecode(token); 
    return decoded.user_id;
  } catch {
    return null;
  }
}
