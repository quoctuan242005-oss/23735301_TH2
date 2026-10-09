import { create } from 'zustand';
import { STUDENT, examStamp } from '@constants/student';

type AuthState = {
  isLoggedIn: boolean;
  token: string | null;
  identifier: string;
  login: (identifier: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  token: null,
  identifier: '',

  login: (identifier: string) => {
    const stamp = examStamp();
    const generatedToken = `ktxgo-${STUDENT.mssv}-${stamp}`;
    set({
      isLoggedIn: true,
      token: generatedToken,
      identifier,
    });
  },

  logout: () => {
    set({
      isLoggedIn: false,
      token: null,
      identifier: '',
    });
  },
}));