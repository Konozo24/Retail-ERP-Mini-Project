package com.retailerp.retailerp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
public class RetailerpApplication {


	
	public static void main(String[] args) {
		SpringApplication.run(RetailerpApplication.class, args);
	}

}
