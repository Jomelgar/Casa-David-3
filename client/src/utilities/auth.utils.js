import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export const getUserFromToken = () => {
  const token = Cookies.get("token");
  if (!token) return null;

  try {
    const decodedToken = jwtDecode(token);
    return decodedToken;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};
