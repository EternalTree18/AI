import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AuthService, { User } from "../services/auth";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in on component mount
    const checkAuth = () => {
      const currentUser = AuthService.getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    const success = await AuthService.login(username, password);
    if (success) {
      setUser(AuthService.getCurrentUser());
    }
    return success;
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
