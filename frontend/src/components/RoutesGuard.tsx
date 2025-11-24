import React from "react";
import type { ReactNode } from "react"; // ReactNode = anything React can render (JSX, components, text, etc.)
import { Navigate } from "react-router-dom"; // Navigate allows redirecting the user
import { useAuth } from "./AuthContext"; // Our custom hook to access login state

// ------------------------
// 1. Define props for route guard components
// ------------------------
// Every guard will wrap children (the page/component to render)
interface GuardProps {
	children: ReactNode;
}

// ------------------------
// 2. PublicRoute
// ------------------------
// This is for pages that should only be accessed by users who are NOT logged in
// Example: /login or /register pages
export const PublicRoute: React.FC<GuardProps> = ({ children }) => {
	const { user } = useAuth(); // Get current user from AuthContext

	// ------------------------
	// Logic:
	// - If user is logged in (user exists), redirect them to home page (/)
	// - If user is NOT logged in, show the children (the page/component)
	// ------------------------
	return user ? <Navigate to="/" replace /> : <>{children}</>;
};

// ------------------------
// 3. PrivateRoute
// ------------------------
// This is for pages that **require authentication**, like /dashboard or /profile
export const PrivateRoute: React.FC<GuardProps> = ({ children }) => {
	const { user, loading } = useAuth(); // Get the current user and loading flag

	// If we are still checking auth state, show nothing (or a loading spinner)
	if (loading) return null;

	// If the user is logged in, render the children (protected page)
	// Otherwise, redirect them to "/login"
	return user ? <>{children}</> : <Navigate to="/login" replace />;
};
