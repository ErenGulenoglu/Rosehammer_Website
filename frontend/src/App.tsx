import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import Home from "./pages/Home";
import LoTA from "./pages/LoTA";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import VerifyEmail from "./pages/VerifyEmail";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import { AuthProvider } from "./components/AuthContext";
import { PublicRoute } from "./components/RoutesGuard";
import { ThemeProvider } from "./components/theme-provider";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import { CartProvider } from "./context/CartContext";

function App() {
	return (
		<AuthProvider>
			<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
				<div>
					<CartProvider>
						<BrowserRouter>
							<Routes>
								<Route path="/" element={<Home />} />
								<Route path="/lota" element={<LoTA />} />
								<Route path="/checkout" element={<Checkout />} />

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
								<Route path="/products/:id" element={<ProductDetail />} />
								<Route path="/cart" element={<Cart />} />

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
					</CartProvider>
				</div>
				<Toaster />
			</ThemeProvider>
		</AuthProvider>
	);
}

export default App;
