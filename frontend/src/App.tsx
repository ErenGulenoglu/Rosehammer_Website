import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
// import NotFound from "./pages/NotFound";
import LoTA from "./pages/LoTA";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import VerifyEmail from "./pages/VerifyEmail";
import Products from "./pages/Products";
import { AuthProvider } from "./components/AuthContext";
import { PublicRoute } from "./components/RoutesGuard";
import { ThemeProvider } from "./components/theme-provider";

function App() {
	return (
		<AuthProvider>
			<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
				<div>
					<BrowserRouter>
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/lota" element={<LoTA />} />

							{/* Public Route */}
							<Route
								path="/login"
								element={
									<PublicRoute>
										<Login />
									</PublicRoute>
								}
							/>

							{/* Public Route */}
							<Route
								path="/signup"
								element={
									<PublicRoute>
										<Signup />
									</PublicRoute>
								}
							/>

							<Route path="/products" element={<Products />} />

							<Route
								path="/verify-email"
								element={
									<PublicRoute>
										<VerifyEmail />
									</PublicRoute>
								}
							/>

							{/* <Route path="*" element={<NotFound />} /> */}
						</Routes>
					</BrowserRouter>
				</div>
			</ThemeProvider>
		</AuthProvider>
	);
}

export default App;
