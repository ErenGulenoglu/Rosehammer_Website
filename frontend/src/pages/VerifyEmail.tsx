import { useEffect, useState } from "react";
import api from "@/api";

function VerifyEmail() {
	const [message, setMessage] = useState("Verifying your email...");
	const [loading, setLoading] = useState(true);
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		const token = new URLSearchParams(window.location.search).get("token");

		if (!token) {
			setMessage("Invalid verification link.");
			setSuccess(false);
			setLoading(false);
			return;
		}

		api
			.get(`/users/verify-email/?token=${encodeURIComponent(token)}`)
			.then((res) => {
				setMessage(res.data?.detail || "Email verified successfully!");
				setSuccess(true);
			})
			.catch((err) => {
				setMessage(err.response?.data?.detail || "Verification failed or link expired.");
				setSuccess(false); // explicitly mark failure
			})
			.finally(() => setLoading(false));
	}, []);

	return (
		<div className="max-w-md mx-auto mt-20 p-6 border rounded-lg shadow-md text-center">
			{loading ? <p className="text-gray-500">Verifying...</p> : <p className={success ? "text-green-600" : "text-red-600"}>{message}</p>}
		</div>
	);
}

export default VerifyEmail;
