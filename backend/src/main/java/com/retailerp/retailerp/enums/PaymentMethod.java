package com.retailerp.retailerp.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.databind.exc.InvalidFormatException;

public enum PaymentMethod {
    CASH,
    CARD;
    
    @JsonCreator
    public static PaymentMethod fromString(String key) throws InvalidFormatException {
        if (key == null)
            return null;
        try {
            return PaymentMethod.valueOf(key.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw InvalidFormatException.from(
                null,
                "Invalid value for PaymentMethod",
                key,
                PaymentMethod.class
            );
        }
    }
}
