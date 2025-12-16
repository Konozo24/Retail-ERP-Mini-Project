package com.retailerp.retailerp.exception;

import java.sql.SQLIntegrityConstraintViolationException;
import java.util.NoSuchElementException;

import javax.security.auth.login.LoginException;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.retailerp.retailerp.auth.UnauthorizedException;

import jakarta.persistence.EntityExistsException;
import jakarta.servlet.http.HttpServletRequest;

@Order(Ordered.HIGHEST_PRECEDENCE)
@ControllerAdvice
public class RestExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<String> handleUnauthorizedException(HttpServletRequest request, UnauthorizedException e) {
        String error = e.getMessage();
        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(SQLIntegrityConstraintViolationException.class)
    public ResponseEntity<String> handleSQLIntegrityException(HttpServletRequest request, SQLIntegrityConstraintViolationException e) {
        String error = "Unable to submit post: " + e.getMessage();
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<String> handleNoSuchElementException(HttpServletRequest request, NoSuchElementException e) {
        String error = "The row for address doesnt exist: " + e.getMessage();
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(LoginException.class)
    public ResponseEntity<String> handleCredentialNotFoundException(HttpServletRequest request, LoginException e) {
        String error = "Unable to login: " + e.getMessage();
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(EntityExistsException.class)
    public ResponseEntity<String> handleEntityExistsException(HttpServletRequest request, EntityExistsException e) {
        String error = "Entity already exist: " + e.getMessage();
        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }
}
