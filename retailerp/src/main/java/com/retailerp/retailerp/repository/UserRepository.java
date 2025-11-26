package com.retailerp.retailerp.repository;

import com.retailerp.retailerp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    //+-----------------------------------------------------------------------+
    //| Find user by username for Login logic                                 |
    //+-----------------------------------------------------------------------+
    Optional<User> findByUsername(String username);

    //+-----------------------------------------------------------------------+
    //| Check if username exists (useful for preventing duplicates)           |
    //+-----------------------------------------------------------------------+
    boolean existsByUsername(String username);
}