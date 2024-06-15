import { jwtDecode } from "jwt-decode";


interface JwtPayload {
  id: number;
  email:string;
}

export const getUserIdFromToken = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    return null;
  }

  try {
    const decodedToken = jwtDecode<JwtPayload>(token);

    return decodedToken.id;
  } catch (error) {
    console.error('Failed to decode JWT token:', error);
    return null;
  }
};