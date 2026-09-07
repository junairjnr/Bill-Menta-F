// import { create } from "zustand";
// import { AuthUser } from "../../types/index";
// import { tokenUtils } from "../../utils/token";

// interface AuthStore {
//   user: AuthUser | null;
//   token: string | null;
//   isAuthenticated: boolean;
//   setAuth: (token: string, user: AuthUser) => void;
//   clearAuth: () => void;
// }

// export const useAuthStore = create<AuthStore>((set) => ({
//   // Initialize from localStorage
//   user:            tokenUtils.getUser(),
//   token:           tokenUtils.getToken(),
//   isAuthenticated: tokenUtils.isAuthenticated(),

//   setAuth: (token, user) => {
//     tokenUtils.setToken(token);
//     tokenUtils.setUser(user);
//     set({ token, user, isAuthenticated: true });
//   },

//   clearAuth: () => {
//     tokenUtils.removeToken();
//     set({ token: null, user: null, isAuthenticated: false });
//   },
// }));

import { create } from "zustand";
import { AuthUser } from "../../types";
import { tokenUtils } from "../../utilsComponents/token";
import { UserPermissions } from "../../config/permissions";

interface AuthStore {
  user: AuthUser | null;
  token: string | null;
  permissions: UserPermissions | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: AuthUser) => void;
  setPermissions: (permissions: UserPermissions) => void;
  clearAuth: () => void;
  loadAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  permissions: null,
  isAuthenticated: false,

  setAuth: (token, user) => {
    tokenUtils.setToken(token);
    tokenUtils.setUser(user);
    set({
      token,
      user,
      permissions: user.permissions ?? null,
      isAuthenticated: true,
    });
  },

  setPermissions: (permissions) => {
    set({ permissions });
  },

  clearAuth: () => {
    tokenUtils.removeToken();
    set({
      token: null,
      user: null,
      permissions: null,
      isAuthenticated: false,
    });
  },

  loadAuth: () => {
    const token = tokenUtils.getToken();
    const user = tokenUtils.getUser();

    set({
      token,
      user,
      permissions: user?.permissions ?? null,
      isAuthenticated: !!token,
    });
  },
}));