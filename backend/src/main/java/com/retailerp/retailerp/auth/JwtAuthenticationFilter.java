package com.retailerp.retailerp.auth;

import java.io.IOException;
import java.util.Optional;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@AllArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtUtil jwtUtil;
	private final PublicEndpoints publicEndpoints;
	private final AuthUserService authUserService;

	private final AntPathMatcher pathMatcher = new AntPathMatcher();

	private Optional<String> getTokenFromRequest(HttpServletRequest request) {
		// request.getHeaderNames().asIterator().forEachRemaining(c ->
		// {System.out.println(request.getHeader(c));});
		String header = request.getHeader("Authorization");
		return (header != null && header.startsWith("Bearer ")) ? Optional.of(header.substring(7)) : Optional.empty();
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
			throws ServletException, IOException {
		String requestPath = request.getRequestURI();

		// Skip JWT validation for public endpoints
		if (isPublicPath(requestPath)) {
			log.info("JWT filter skip for public path: {}", requestPath);
			chain.doFilter(request, response);
			return;
		}

		getTokenFromRequest(request).ifPresent(token -> {
			if (jwtUtil.validateToken(token)) {
				log.debug("JWT filter authenticated path: {}", requestPath);
				Long userId = jwtUtil.extractUserId(token);
				AuthUser authUser = authUserService.loadUserByUserId(userId);
				UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
						authUser, null, authUser.getAuthorities());
				authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
				SecurityContextHolder.getContext().setAuthentication(authentication);
			} else {
				log.warn("JWT filter token invalid for path: {}", requestPath);
			}
		});

		if (!getTokenFromRequest(request).isPresent()) {
			log.info("JWT filter no token for protected path: {}", requestPath);
		}

		chain.doFilter(request, response);
	}

	private boolean isPublicPath(String requestPath) {
		return publicEndpoints.getPaths()
				.stream()
				.anyMatch(pattern -> pathMatcher.match(pattern, requestPath));
	}
}