// All token operations in one place — never scattered across files

const TOKEN_KEY = "TOKEN";
const USER_KEY = "USER";

export const tokenUtils = {
  getToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  },

  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(TOKEN_KEY, token);
  },

  removeToken: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  },

  getUser: () => {
    if (typeof window === "undefined") return null;
    const user =
      localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    if (!user) return null;
    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  },

  setUser: (user: object): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  isAuthenticated: (): boolean => {
    return !!tokenUtils.getToken();
  },
};
