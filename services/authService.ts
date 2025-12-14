import { User } from '../types';

const STORAGE_KEY = 'dreamdesign_users';
const CURRENT_USER_KEY = 'dreamdesign_current_user_id';

// Helper to get all users
function getUsers(): Record<string, User> {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
}

// Helper to save users
function saveUsers(users: Record<string, User>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export const authService = {
  // Sign Up
  signup: async (firstName: string, lastName: string, email: string, password: string): Promise<User> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const users = getUsers();
    const id = email.toLowerCase(); // Simple ID strategy

    if (users[id]) {
      throw new Error("User already exists with this email.");
    }

    const newUser: User = {
      id,
      firstName,
      lastName,
      email,
      credits: 1, // Start with 1 free credit
      avatar: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=154845&color=fff`
    };

    users[id] = newUser;
    saveUsers(users);
    localStorage.setItem(CURRENT_USER_KEY, id);
    return newUser;
  },

  // Log In
  login: async (email: string, password: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const users = getUsers();
    const id = email.toLowerCase();
    const user = users[id];

    if (!user) {
      throw new Error("Invalid email or password.");
    }
    
    // In a real app, verify password hash. Here we just accept.
    localStorage.setItem(CURRENT_USER_KEY, id);
    return user;
  },

  // Logout
  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  // Get Current User (Session persistence)
  getCurrentUser: (): User | null => {
    const id = localStorage.getItem(CURRENT_USER_KEY);
    if (!id) return null;
    const users = getUsers();
    return users[id] || null;
  },

  // Google Mock Login
  loginWithGoogle: async (): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockEmail = "demo@gmail.com";
    const users = getUsers();
    
    if (!users[mockEmail]) {
        // Create if doesn't exist
        const newUser: User = {
            id: mockEmail,
            firstName: "Demo",
            lastName: "User",
            email: mockEmail,
            credits: 3, // Bonus for demo
            avatar: "https://lh3.googleusercontent.com/a/default-user=s96-c"
        };
        users[mockEmail] = newUser;
        saveUsers(users);
    }
    
    localStorage.setItem(CURRENT_USER_KEY, mockEmail);
    return users[mockEmail];
  },

  // Credit Management
  deductCredits: (userId: string, amount: number): User => {
    const users = getUsers();
    const user = users[userId];
    if (!user) throw new Error("User not found");
    
    if (user.credits < amount) {
        throw new Error("Insufficient credits");
    }

    user.credits -= amount;
    users[userId] = user;
    saveUsers(users);
    return user;
  },

  addCredits: (userId: string, amount: number): User => {
    const users = getUsers();
    const user = users[userId];
    if (!user) throw new Error("User not found");

    user.credits += amount;
    users[userId] = user;
    saveUsers(users);
    return user;
  }
};