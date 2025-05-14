// User interface
export interface User {
  name: string;
  email: string;
  avatar: string;
  role: string;
}

// Authentication service
const AuthService = {
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return localStorage.getItem("authToken") !== null;
  },

  // Get current user
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as User;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  },

  // Login method
  login: async (username: string, password: string): Promise<boolean> => {
    // In a real application, this would make an API call to authenticate
    // For this example, we'll use a simple mock
    if (username === "admin" && password === "password") {
      // Store mock token and user data
      localStorage.setItem("authToken", "mock-jwt-token");
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: "DREYZIE",
          email: "admin@university.edu",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
          role: "Administrator",
        }),
      );
      return true;
    }
    return false;
  },

  // Logout method
  logout: (): void => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  },
};

export default AuthService;
