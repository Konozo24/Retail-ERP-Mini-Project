package com.retailerp.retailerp.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.retailerp.retailerp.repository.UserRepository;
import com.retailerp.retailerp.repository.ForgotPasswordRepository;
import com.retailerp.retailerp.service.EmailService;
import com.retailerp.retailerp.utils.ChangePassword;

import lombok.RequiredArgsConstructor;

import com.retailerp.retailerp.model.ForgotPassword;
import com.retailerp.retailerp.model.User;
import com.retailerp.retailerp.dto.email.MailBody;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.Objects;
import java.util.Random;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/forgot-password")
@RequiredArgsConstructor
public class ForgotPasswordController {

	private final UserRepository userRepository;
	private final ForgotPasswordRepository forgotPasswordRepository;
	private final EmailService emailService;
	private final PasswordEncoder passwordEncoder;

	// send mail for email verification
	@PostMapping("/verifyMail/{email}")
	public ResponseEntity<String> verifyEmail(@PathVariable String email) {
		String decodedEmail = URLDecoder.decode(email, StandardCharsets.UTF_8);
		User user = userRepository.findByEmail(decodedEmail)
				.orElseThrow(() -> new UsernameNotFoundException("Please provide a valid email!"));

		int otp = otpGenerator();
		MailBody mailBody = MailBody.builder()
				.to(decodedEmail)
				.text("This is the OTP for your forgot password request:" + otp)
				.subject("OTP for Forgot Password request")
				.build();

		ForgotPassword fp = ForgotPassword.builder()
				.otp(otp)
				.expirationTime(new Timestamp(System.currentTimeMillis() + 5 * 60 * 1000)) // 5 minutes
				.user(user)
				.build();

		emailService.sendSimpleMessage(mailBody);
		forgotPasswordRepository.save(fp);

		return ResponseEntity.ok("Email sent for verification!");
	}

	@PostMapping("/verify-otp/{otp}/{email}")
	public ResponseEntity<String> verifyOtp(@PathVariable Integer otp, @PathVariable String email) {
		String decodedEmail = URLDecoder.decode(email, StandardCharsets.UTF_8);
		User user = userRepository.findByEmail(decodedEmail)
				.orElseThrow(() -> new UsernameNotFoundException("Please provide a valid email!"));

		ForgotPassword fp = forgotPasswordRepository.findByOtpAndUser(otp, user)
				.orElseThrow(() -> new RuntimeException("Invalid OTP for email: " + email));

		if (fp.getExpirationTime().before(Timestamp.from(Instant.now()))) {
			forgotPasswordRepository.deleteById(fp.getId());
			return new ResponseEntity<>("OTP has expired!", HttpStatus.EXPECTATION_FAILED);
		}

		return ResponseEntity.ok("OTP verified successfully!");
	}

	@PostMapping("/changePassword/{email}")
	public ResponseEntity<String> changePasswordHandler(
			@RequestBody ChangePassword changePassword,
			@PathVariable String email) {

		String decodedEmail = URLDecoder.decode(email, StandardCharsets.UTF_8);

		if (!Objects.equals(changePassword.password(), changePassword.repeatPassword())) {
			return new ResponseEntity<>("Passwords do not match!", HttpStatus.BAD_REQUEST);
		}

		String encodedPassword = passwordEncoder.encode(changePassword.password());
		userRepository.updatePassword(decodedEmail, encodedPassword);

		return ResponseEntity.ok("Password changed successfully!");
	}

	private Integer otpGenerator() {
		Random random = new Random();
		return random.nextInt(100_000, 999_999); // return 6 digit otp
	}

}
