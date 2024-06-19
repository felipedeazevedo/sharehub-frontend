import { jwtDecode } from "jwt-decode";


interface JwtPayload {
  id: number;
  name: string
  email:string;
  type: string;
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

export const isUserLoggedIn = () => {
  const token = localStorage.getItem('accessToken');
  return token !== null;
};

export const getUserNameFromToken = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    return null;
  }

  try {
    const decodedToken = jwtDecode<JwtPayload>(token);

    return decodedToken.name;
  } catch (error) {
    console.error('Failed to decode JWT token:', error);
    return null;
  }
};

export const getUserTypeFromToken = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    return null;
  }

  try {
    const decodedToken = jwtDecode<JwtPayload>(token);

    return decodedToken.type;
  } catch (error) {
    console.error('Failed to decode JWT token:', error);
    return null;
  }
};