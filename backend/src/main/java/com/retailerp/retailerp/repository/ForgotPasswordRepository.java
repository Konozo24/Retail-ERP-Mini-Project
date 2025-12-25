package com.retailerp.retailerp.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.retailerp.retailerp.model.ForgotPassword;
import com.retailerp.retailerp.model.User;

public interface ForgotPasswordRepository extends JpaRepository<ForgotPassword, Integer> {

	Optional<ForgotPassword> findByOtpAndUser(Integer otp, User user);

}
