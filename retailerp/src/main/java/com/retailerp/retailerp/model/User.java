package com.retailerp.retailerp.model;

import java.io.Serializable;
import java.time.OffsetDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "TB_USER")
public class User implements Serializable {

    private static final long serialVersionUID = 4259831600299829999L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "U_ID")
    private Long id;

    @Column(name = "U_USER_NAME", nullable = false, unique = true)
    private String username;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "U_ROLE", nullable = false)
    private UserRoleEnum role = UserRoleEnum.CLIENT;

    @Column(name = "U_CREATED_AT", nullable = false, updatable = false)
    private OffsetDateTime createdAt;
    
	@Column(name = "U_PASSWD_CIPHERTEXT", length = 128)	
	private String	cipherText;

    @PrePersist
    protected void onCreate() {
        this.createdAt = OffsetDateTime.now();
    }
    
    @Column(name = "U_TOKEN_VERSION", nullable = false)
    private Integer tokenVersion = 0;  // default version is 0
    
    // --- Getters and Setters ---

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public UserRoleEnum getRole() {
		return role;
	}

	public void setRole(UserRoleEnum role) {
		this.role = role;
	}

	public OffsetDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(OffsetDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public String getCipherText() {
		return cipherText;
	}

	public void setCipherText(String cipherText) {
		this.cipherText = cipherText;
	}

	public Integer getTokenVersion() {
		return tokenVersion;
	}

	public void setTokenVersion(Integer tokenVersion) {
		this.tokenVersion = tokenVersion;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	@Override
	public String toString() {
		return "User [" + (id != null ? "id=" + id + ", " : "")
				+ (username != null ? "username=" + username + ", " : "") + (role != null ? "role=" + role + ", " : "")
				+ (createdAt != null ? "createdAt=" + createdAt + ", " : "")
				+ (cipherText != null ? "cipherText=" + cipherText + ", " : "cipherText=NotSet, ")
				+ (tokenVersion != null ? "tokenVersion=" + tokenVersion : "") + "]";
	}

}
