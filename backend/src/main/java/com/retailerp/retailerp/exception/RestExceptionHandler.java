package com.retailerp.retailerp.exception;

import java.sql.SQLIntegrityConstraintViolationException;
import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.security.auth.login.LoginException;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import com.retailerp.retailerp.auth.UnauthorizedException;

import jakarta.persistence.EntityExistsException;
import jakarta.servlet.http.HttpServletRequest;

@Order(Ordered.HIGHEST_PRECEDENCE)
@ControllerAdvice
public class RestExceptionHandler extends ResponseEntityExceptionHandler {

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
        MethodArgumentNotValidException ex,
        HttpHeaders headers,
        HttpStatusCode status,
        WebRequest request
    ) {
        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors()
                .forEach(err -> errors.put(err.getField(), err.getDefaultMessage()));

        return ResponseEntity.badRequest().body(errors);
    }

    @Override
    public ResponseEntity<Object> handleHttpMessageNotReadable(
        HttpMessageNotReadableException ex,
        HttpHeaders headers,
        HttpStatusCode status,
        WebRequest request
    ) {
        Throwable cause = ex.getCause();

        if (cause instanceof InvalidFormatException ife) {
            Class<?> targetType = ife.getTargetType();
            Object invalidValue = ife.getValue();

            if (targetType.isEnum()) {
                String allowedValues = String.join(", ",
                        java.util.Arrays.stream(targetType.getEnumConstants())
                                .map(Object::toString)
                                .toArray(String[]::new));

                String message = String.format(
                        "Invalid value '%s' for enum '%s'. Allowed values are: %s",
                        invalidValue,
                        targetType.getSimpleName(),
                        allowedValues);
                return ResponseEntity.badRequest().body(message);
            }
        }

        // fallback
        return ResponseEntity.badRequest().body("Malformed JSON request");
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(HttpServletRequest request, IllegalArgumentException ex) {
        String error = ex.getMessage();
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<String> handleUnauthorizedException(HttpServletRequest request, UnauthorizedException ex) {
        String error = ex.getMessage();
        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<String> handleIllegalStateException(HttpServletRequest request, IllegalStateException ex) {
        String error = ex.getMessage();
        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(SQLIntegrityConstraintViolationException.class)
    public ResponseEntity<String> handleSQLIntegrityException(HttpServletRequest request,
            SQLIntegrityConstraintViolationException ex) {
        String error = ex.getMessage();
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleUniqueConstraint(DataIntegrityViolationException ex) {
        String errMsg = ex.getRootCause() != null ? ex.getRootCause().getMessage() : ex.getMessage();

        System.out.println("\n\n\n" + errMsg + "\n\n\n");
        Pattern columnPattern = Pattern.compile(
                "UK_([A-Z]+)_.+" + "\\(([A-Z]+) .*\\) VALUES.+" + " ('.+?') \\)");
        Matcher matcher = columnPattern.matcher(errMsg);
        String tableName = null;
        String columnName = null;
        String fieldValue = null;
        if (matcher.find()) {
            tableName = matcher.group(1).toLowerCase();
            columnName = matcher.group(2).toLowerCase();
            fieldValue = matcher.group(3);
        }

        String message = String.format(
                "The %s, %s is already used by another %s",
                columnName, fieldValue, tableName);

        Map<String, String> error = new HashMap<>();
        error.put(columnName, message);
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<String> handleNoSuchElementException(HttpServletRequest request, NoSuchElementException ex) {
        String error = ex.getMessage();
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(LoginException.class)
    public ResponseEntity<String> handleCredentialNotFoundException(HttpServletRequest request, LoginException ex) {
        String error = ex.getMessage();
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(EntityExistsException.class)
    public ResponseEntity<String> handleEntityExistsException(HttpServletRequest request, EntityExistsException ex) {
        String error = ex.getMessage();
        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }
}
