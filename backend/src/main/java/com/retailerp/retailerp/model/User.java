package com.retailerp.retailerp.model;

import java.time.OffsetDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.retailerp.retailerp.enums.UserRoleEnum;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "USERS", uniqueConstraints = {
		@UniqueConstraint(name = "UK_USER_EMAIL", columnNames = "EMAIL")
})
@NoArgsConstructor
@Getter
@Setter
@ToString
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "USER_ID")
	private Long id;

	@Column(name = "EMAIL", nullable = false)
	private String email;

	@Enumerated(EnumType.STRING)
	@Column(name = "ROLE", nullable = false)
	private UserRoleEnum role = UserRoleEnum.CASHIER;

	@Column(name = "PASSWD_CIPHERTEXT", nullable = false)
	private String cipherText;

	@CreationTimestamp
	@Column(name = "CREATED_AT", nullable = false, updatable = false)
	private OffsetDateTime createdAt;

	@Column(name = "INACTIVE", nullable = false)
	private boolean inactive = false;

	public User(String email, String cipherText) {
		this.email = email;
		this.cipherText = cipherText;
	}
}
