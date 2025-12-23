import React, { useState } from "react";
import { Mail, Hash, Lock, ArrowLeft } from "lucide-react";
import { useSendForgotEmail, useVerifyOtp, useChangePassword } from "../api/forgot-password.api";
import { useNavigate } from "react-router-dom";

// Define steps for the forgot password process
const Step = {
	EMAIL: "email",
	OTP: "otp",
	RESET: "reset",
	DONE: "done",
};

export default function ForgotPassword() {

	// State
	const [email, setEmail] = useState("");
	const [otp, setOtp] = useState("");
	const [password, setPassword] = useState("");
	const [repeatPassword, setRepeatPassword] = useState("");
	const [step, setStep] = useState(Step.EMAIL);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	// API Hooks
	const sendMail = useSendForgotEmail();
	const verifyOtp = useVerifyOtp();
	const changePwd = useChangePassword();

	const handleSendMail = async (e) => {
		e.preventDefault();
		setError("");
		if (!email) {
			setError("Please enter your email.");
			return;
		}
		try {
			await sendMail.mutateAsync(email.trim());
			setStep(Step.OTP);
		} catch (err) {
			const data = err?.response?.data;
			let message = "Failed to send OTP.";
			if (typeof data === "string") message = data;
			else if (data?.message && typeof data.message === "string") message = data.message;
			else if (data && typeof data === "object") message = Object.values(data).join(", ");
			else if (err?.message) message = err.message;
			setError(message);
		}
	};

	const handleVerifyOtp = async (e) => {
		e.preventDefault();
		setError("");
		if (!otp) {
			setError("Enter the OTP sent to your email.");
			return;
		}
		try {
			await verifyOtp.mutateAsync({ email: email.trim(), otp: otp.trim() });
			setStep(Step.RESET);
		} catch (err) {
			const data = err?.response?.data;
			let message = "Invalid or expired OTP.";
			if (typeof data === "string") message = data;
			else if (data?.message && typeof data.message === "string") message = data.message;
			else if (data && typeof data === "object") message = Object.values(data).join(", ");
			else if (err?.message) message = err.message;
			setError(message);
		}
	};

	const handleChangePassword = async (e) => {
		e.preventDefault();
		setError("");
		if (!password || !repeatPassword) {
			setError("Please fill both password fields.");
			return;
		}
		if (password.length < 6) {
			setError("Password must be at least 6 characters long.");
			return;
		}
		if (password !== repeatPassword) {
			setError("Passwords do not match.");
			return;
		}
		try {
			await changePwd.mutateAsync({ email: email.trim(), password, repeatPassword });
			setStep(Step.DONE);
		} catch (err) {
			const data = err?.response?.data;
			let message = "Failed to update password.";
			if (typeof data === "string") message = data;
			else if (data?.message && typeof data.message === "string") message = data.message;
			else if (data && typeof data === "object") message = Object.values(data).join(", ");
			else if (err?.message) message = err.message;
			setError(message);
		}
	};

	const isLoading = sendMail.isPending || verifyOtp.isPending || changePwd.isPending;

	const renderContent = () => {
		switch (step) {
			case Step.EMAIL:
				return (
					<form className="space-y-6" onSubmit={handleSendMail}>
						<div>
							<label className="block text-sm font-medium text-foreground mb-2">Email</label>
							<div className="relative">
								<Mail className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
								<input
									type="email"
									className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
									placeholder="you@example.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
						</div>
						{error && <p className="text-sm text-destructive">{error}</p>}
						<button
							type="submit"
							disabled={isLoading}
							className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-70"
						>
							{isLoading ? "Sending..." : "Send OTP"}
						</button>
					</form>
				);
			case Step.OTP:
				return (
					<form className="space-y-6" onSubmit={handleVerifyOtp}>
						<div>
							<label className="block text-sm font-medium text-foreground mb-2">Enter OTP</label>
							<div className="relative">
								<Hash className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
								<input
									type="text"
									className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
									placeholder="6-digit code"
									value={otp}
									onChange={(e) => setOtp(e.target.value)}
								/>
							</div>
						</div>
						{error && <p className="text-sm text-destructive">{error}</p>}
						<button
							type="submit"
							disabled={isLoading}
							className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-70"
						>
							{isLoading ? "Verifying..." : "Verify OTP"}
						</button>
						<button
							type="button"
							onClick={() => setStep(Step.EMAIL)}
							className="w-full text-sm text-muted-foreground hover:text-foreground"
						>
							Resend code
						</button>
					</form>
				);
			case Step.RESET:
				return (
					<form className="space-y-6" onSubmit={handleChangePassword}>
						<div>
							<label className="block text-sm font-medium text-foreground mb-2">New Password</label>
							<div className="relative">
								<Lock className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
								<input
									type="password"
									className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
									placeholder="New password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</div>
						</div>
						<div>
							<label className="block text-sm font-medium text-foreground mb-2">Repeat Password</label>
							<div className="relative">
								<Lock className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
								<input
									type="password"
									className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
									placeholder="Repeat password"
									value={repeatPassword}
									onChange={(e) => setRepeatPassword(e.target.value)}
								/>
							</div>
						</div>
						{error && <p className="text-sm text-destructive">{error}</p>}
						<button
							type="submit"
							disabled={isLoading}
							className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-70"
						>
							{isLoading ? "Saving..." : "Change Password"}
						</button>
					</form>
				);
			case Step.DONE:
			default:
				return (
					<div className="space-y-4 text-center">
						<div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 text-green-700 font-bold text-2xl">✓</div>
						<h2 className="text-xl font-semibold text-foreground">Password updated</h2>
						<p className="text-muted-foreground text-sm">You can now log in with your new password.</p>
						<button
							onClick={() => navigate("/login")}
							className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90"
						>
							Back to Login
						</button>
					</div>
				);
		}
	};

	return (
		<div className="min-h-screen bg-linear-to-br from-primary via-primary/80 to-accent/60 flex items-center justify-center p-4">
			<div className="bg-card rounded-2xl shadow-2xl w-full max-w-md p-8 border border-border">
				<button
					onClick={() => navigate(-1)}
					className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
				>
					<ArrowLeft className="w-4 h-4 mr-1" /> Back
				</button>
				<div className="text-center mb-6">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
						<Lock className="w-8 h-8 text-primary-foreground" />
					</div>
					<h1 className="text-2xl font-bold text-foreground">Forgot Password</h1>
					<p className="text-muted-foreground mt-2 text-sm">
						{step === Step.EMAIL && "Enter your email to receive an OTP."}
						{step === Step.OTP && "Check your email and enter the OTP."}
						{step === Step.RESET && "Set a new password."}
						{step === Step.DONE && "All set!"}
					</p>
				</div>
				{renderContent()}
			</div>
		</div>
	);
}
