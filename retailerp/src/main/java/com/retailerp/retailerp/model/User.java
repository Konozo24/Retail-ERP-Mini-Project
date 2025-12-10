package com.retailerp.retailerp.model;

import java.time.OffsetDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "USERS")
@NoArgsConstructor
@Getter
@Setter
@ToString
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "USER_ID")
    private Long id;

    @Column(name = "USERNAME", nullable = false, unique = true, length = 20)
    private String username;
    
    // TODO: Only got one role, cashier
    // @Enumerated(EnumType.STRING)
    // @Column(name = "ROLE", nullable = false)
    // private UserRoleEnum role = UserRoleEnum.CASHIER;

	@Column(name = "PASSWD_CIPHERTEXT", nullable = false)	
	private String	cipherText;

	// TODO: No need store JWT token in server
	// @Column(name = "U_TOKEN_VERSION", nullable = false)
    // private Integer tokenVersion = 0;  // default version is 0

    @CreationTimestamp
    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    public User(String username, String cipherText) {
        this.username = username;
        this.cipherText = cipherText;
    }
}
