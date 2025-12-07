import React from "react";
import { GalleryVerticalEnd } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

import api from "@/api";
import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

export function SignUpForm({ className, ...props }: React.ComponentProps<"div">) {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirm, setPasswordConfirm] = useState("");
	const [error, setError] = useState("");
	const [hasError, setHasError] = useState(false);
	const [showLoading, setShowLoading] = useState(false);
	const [isDisabled, setIsDisabled] = useState(false);
	const [showConfirmation, setShowConfirmation] = useState(false);
	// const navigate = useNavigate();

	useEffect(() => {
		document.title = "Sign Up";
	}, []);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			setShowLoading(true);
			setHasError(false);
			setIsDisabled(true);

			// ------------------------
			// 1. Login: backend sets HttpOnly refresh token cookie
			// ------------------------
			api.post(
				"/users/signup/",
				{ first_name: firstName, last_name: lastName, email, password, passwordConfirm }, // everything matches with serialzier names
				{ withCredentials: true } // important: send/receive cookies
			);
			// console.log("Signup successful:", signupRes.data);
			setError("");
			setShowConfirmation(true); // add this once you move to non-free tier
			// navigate("/login"); // redirect after login
		} catch (err: any) {
			console.error("Signup failed:", err);
			setIsDisabled(false);
			// DRF validation errors come back as JSON
			if (err.response?.data) {
				const data = err.response.data;
				// Combine all error messages (or display per field)
				const messages = Object.values(data).flat().join(" ");
				setError(messages);
				setHasError(true);
			} else {
				setError("Something went wrong during signup.");
			}
		} finally {
			setShowLoading(false);
		}
	};

	async function handleResend() {
		try {
			const reSendRes = await api.post(
				"/users/signup/",
				{ first_name: firstName, last_name: lastName, email, password, passwordConfirm }, // everything matches with serialzier names
				{ withCredentials: true } // important: send/receive cookies
			);

			console.log(reSendRes.data);
		} catch (err: any) {
			console.log(err.response?.data?.detail || "Something went wrong.");
		}
	}

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
						<h1 className="text-xl font-bold">Sign Up</h1>
						<FieldDescription>Let's get started. Fill in the details below to create your account.</FieldDescription>
					</div>

					<Field>
						<FieldLabel htmlFor="firstName">First Name</FieldLabel>
						<Input disabled={isDisabled} id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" required />
					</Field>

					<Field>
						<FieldLabel htmlFor="lastName">Last Name</FieldLabel>
						<Input disabled={isDisabled} id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Smith" required />
					</Field>

					<Field>
						<FieldLabel htmlFor="email">Email</FieldLabel>
						<Input disabled={isDisabled} id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="m@example.com" required />
					</Field>

					<Field>
						<FieldLabel htmlFor="password">Password</FieldLabel>
						<Input disabled={isDisabled} id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
					</Field>

					<Field>
						<FieldLabel htmlFor="passwordConfirm">Confirm Password</FieldLabel>
						<Input disabled={isDisabled} id="passwordConfirm" type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} required />
					</Field>

					{hasError && <p className="text-red-600">{error}</p>}

					{showLoading ? (
						<div className="flex flex-col items-center text-center">
							<Spinner />
						</div>
					) : showConfirmation ? null : (
						<Field className="text-center">
							<Button type="submit" className="cursor-pointer">
								Sign Up
							</Button>
						</Field>
					)}
				</FieldGroup>
			</form>

			{showConfirmation ? (
				<div className="flex flex-col items-center gap-4 text-center">
					<Button onClick={handleResend} className="w-full cursor-pointer">
						Resend Verification Email
					</Button>
					<p className="text-green-600">A confirmation email has been sent to activate your account.</p>
				</div>
			) : null}
			<FieldDescription className="px-6 text-center">
				By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
			</FieldDescription>
		</div>
	);
}
