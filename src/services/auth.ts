// auth.ts
export const setToken = (token: string): void => {
  localStorage.setItem('jwtToken', token);
};

export const clearToken = (): void => {
  localStorage.removeItem('jwtToken');
};

export const getToken = (): string | null => {
  return localStorage.getItem('jwtToken');
};
