package com.retailerp.retailerp.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.retailerp.retailerp.model.User;

import jakarta.transaction.Transactional;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {

	@Query("SELECT u FROM User u WHERE LOWER(u.email) = LOWER(:email)")
	Optional<User> findByEmail(String email);

	@Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM User u WHERE LOWER(u.email) = LOWER(:email)")
	Boolean existsByEmail(String email);

	@Transactional
	@Modifying
	@Query("UPDATE User u SET u.cipherText = :password WHERE LOWER(u.email) = LOWER(:email)")
	void updatePassword(String email, String password);
}