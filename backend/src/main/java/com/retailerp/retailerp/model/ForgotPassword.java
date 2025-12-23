package com.retailerp.retailerp.model;

import java.sql.Timestamp;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Builder
public class ForgotPassword {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer fpid;

	@Column(nullable = false)
	private Integer otp;

	@Column(nullable = false)
	private Timestamp expirationTime;

	@OneToOne
	private User user;
}
