import { createContext, useContext, useReducer, useMemo, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);
const initialState = { user: null, token: null, isAuthenticated: false, isLoading: true, role: null };

function authReducer(state, { type, payload }) {
  switch (type) {
    case 'LOGIN_SUCCESS': return { ...state, user: payload.user, token: payload.token, isAuthenticated: true, isLoading: false, role: payload.user?.role || 'user' };
    case 'LOGOUT':        return { ...initialState, isLoading: false };
    case 'SET_LOADING':   return { ...state, isLoading: payload };
    case 'HYDRATE':       return { ...state, user: payload.user, token: payload.token, isAuthenticated: true, isLoading: false, role: payload.user?.role || 'user' };
    default:              return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem('inec_token');
    const raw   = localStorage.getItem('inec_user');
    if (token && raw) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp && decoded.exp < Date.now() / 1000) {
          localStorage.removeItem('inec_token'); localStorage.removeItem('inec_user');
          dispatch({ type: 'SET_LOADING', payload: false });
        } else {
          dispatch({ type: 'HYDRATE', payload: { token, user: JSON.parse(raw) } });
        }
      } catch {
        localStorage.removeItem('inec_token'); localStorage.removeItem('inec_user');
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const login  = (token, user) => { localStorage.setItem('inec_token', token); localStorage.setItem('inec_user', JSON.stringify(user)); dispatch({ type: 'LOGIN_SUCCESS', payload: { token, user } }); };
  const logout = () => { localStorage.removeItem('inec_token'); localStorage.removeItem('inec_user'); dispatch({ type: 'LOGOUT' }); };
  const value  = useMemo(() => ({ ...state, login, logout }), [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};