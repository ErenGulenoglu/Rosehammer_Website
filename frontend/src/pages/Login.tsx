import { LoginForm } from "@/components/LoginForm";
import { useEffect } from "react";

export default function Login() {
	useEffect(() => {
		document.title = "Login";
	}, []);
	return (
		<div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
			<div className="w-full max-w-sm">
				<LoginForm />
			</div>
		</div>
	);
}
