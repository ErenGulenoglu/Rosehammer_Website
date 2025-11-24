import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import api from "@/api";

// ------------------------
// 1. Define the shape of the "user" data
// ------------------------
interface User {
	token: string; // JWT access token (stored in memory only)
	email?: string; // user's email
	first_name?: string; // user's first name
	last_name?: string; // user's last name
}

// ------------------------
// 2. Define the shape of the authentication context
// ------------------------
interface AuthContextType {
	user: User | null; // null if no one is logged in
	setUser: React.Dispatch<React.SetStateAction<User | null>>; // updates user state
	loading: boolean; // true while checking login status
	refreshAccessToken: () => Promise<string | null>; // function to refresh access token
}

// ------------------------
// 3. Create the context
// ------------------------
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ------------------------
// 4. Props for AuthProvider
// ------------------------
interface AuthProviderProps {
	children: ReactNode;
}

// ------------------------
// 5. AuthProvider component
// ------------------------
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	// Function to refresh access token using HttpOnly cookie
	const refreshAccessToken = async (): Promise<string | null> => {
		try {
			//console.log(api);
			const res = await api.post("/users/token/refresh/"); // returns null

			const newAccess = res.data.access;
			return newAccess;
		} catch (err) {
			setUser(null); // refresh failed → user logged out
			return null;
		}
	};

	// On mount, check if a user is logged in
	useEffect(() => {
		const initAuth = async () => {
			const access = await refreshAccessToken();
			console.log(user);

			if (access) {
				// Fetch user profile using the access token
				const profileRes = await api.get("/users/me/", {
					headers: { Authorization: `Bearer ${access}` },
				});
				setUser({ token: access, ...profileRes.data });
			}
			setLoading(false); // done checking login
		};
		initAuth();
	}, []);

	return <AuthContext.Provider value={{ user, setUser, loading, refreshAccessToken }}>{children}</AuthContext.Provider>;
};

// ------------------------
// 6. Custom hook to consume AuthContext
// ------------------------
export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) throw new Error("useAuth must be used within AuthProvider");
	return context;
};
