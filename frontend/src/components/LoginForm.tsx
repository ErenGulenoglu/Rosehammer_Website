import { GalleryVerticalEnd } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

import api from "@/api";
import { useState } from "react";
import { useAuth } from "./AuthContext";
import { Link, useNavigate } from "react-router-dom";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
	const { setUser } = useAuth(); // AuthContext to store access token + user info
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [hasError, setHasError] = useState(false);
	const [showLoading, setShowLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			setShowLoading(true);
			setHasError(false);

			// ------------------------
			// 1. Login: backend sets HttpOnly refresh token cookie
			// ------------------------
			const accessRes = await api.post(
				"/users/token/",
				{ email, password },
				{ withCredentials: true } // important: send/receive cookies
			);

			const access = accessRes.data.access; // access token from backend

			// ------------------------
			// 2. Fetch user profile using access token
			// ------------------------
			const profileRes = await api.get("/users/me/", {
				headers: { Authorization: `Bearer ${access}` }, // send access token in header
			});

			// ------------------------
			// 3. Store user info + access token in memory (AuthContext)
			// ------------------------
			setUser({
				token: access,
				email: profileRes.data.email,
				first_name: profileRes.data.first_name,
				last_name: profileRes.data.last_name,
			});

			setError("");
			navigate("/"); // redirect after login
		} catch (err) {
			console.error("Login failed:", err);
			setError("Wrong email or password.");
			setHasError(true);
		} finally {
			setShowLoading(false);
		}
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<form onSubmit={handleSubmit}>
				<FieldGroup>
					<div className="flex flex-col items-center gap-2 text-center">
						<a href="#" className="flex flex-col items-center gap-2 font-medium">
							<div className="flex size-8 items-center justify-center rounded-md">
								<GalleryVerticalEnd className="size-6" />
							</div>
							<span className="sr-only">Logo</span>
						</a>
						<h1 className="text-xl font-bold">Welcome to Rosehammer Studios</h1>
						<FieldDescription>
							Don&apos;t have an account? <Link to="/signup">Sign up</Link>
						</FieldDescription>
					</div>

					<Field>
						<FieldLabel htmlFor="email">Email</FieldLabel>
						<Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="m@example.com" required />
					</Field>

					<Field>
						<FieldLabel htmlFor="password">Password</FieldLabel>
						<Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
					</Field>

					{hasError && <p className="text-red-600">{error}</p>}

					{showLoading ? (
						<div className="flex flex-col items-center text-center">
							<Spinner />
						</div>
					) : (
						<Field>
							<Button type="submit" className="cursor-pointer">
								Login
							</Button>
						</Field>
					)}
				</FieldGroup>
			</form>

			<FieldDescription className="px-6 text-center">
				By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
			</FieldDescription>
		</div>
	);
}
