package com.retailerp.retailerp.auth;

import java.util.List;

import org.springframework.stereotype.Component;

@Component
public class PublicEndpoints {

	private final List<String> publicPaths = List.of(
			// PUBLIC API PATHS
			"/api/auth/**",
			"/api/forgot-password/**",

			// FRONTEND PATHS
			"/index.html",
			"/favicon.ico",
			"/assets/**",
			"/images/**",
			"/static/**",

			// SAWGGER UI PATHS
			"/swagger-ui/**",
			"/swagger-ui.html",
			"/v3/api-docs/**",

			// H2 CONSOLE PATHS
			"/h2-console/**");

	public List<String> getPaths() {
		return publicPaths;
	}
}