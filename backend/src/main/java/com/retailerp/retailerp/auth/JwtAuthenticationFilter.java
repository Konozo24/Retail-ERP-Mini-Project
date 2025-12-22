package com.retailerp.retailerp.auth;

import java.io.IOException;
import java.util.Optional;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;

@Component
@AllArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtUtil jwtUtil;

	private final AuthUserService authUserService;

	private Optional<String> getTokenFromRequest(HttpServletRequest request)
	{
		// request.getHeaderNames().asIterator().forEachRemaining(c -> {System.out.println(request.getHeader(c));});
		String header = request.getHeader("Authorization");
		return (header != null && header.startsWith("Bearer ")) ? Optional.of(header.substring(7)) : Optional.empty();
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
		throws ServletException, IOException
	{
		getTokenFromRequest(request).ifPresent(token -> {
			if (jwtUtil.validateToken(token)) {
				Long userId = jwtUtil.extractUserId(token);
				AuthUser authUser = authUserService.loadUserByUserId(userId);
				UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
					authUser, null, authUser.getAuthorities());
				authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
				SecurityContextHolder.getContext().setAuthentication(authentication);
			}
		});

		chain.doFilter(request, response);
	}

}
