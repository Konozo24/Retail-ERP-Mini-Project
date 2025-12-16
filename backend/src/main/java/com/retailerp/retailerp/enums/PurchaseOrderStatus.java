package com.retailerp.retailerp.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.databind.exc.InvalidFormatException;

public enum PurchaseOrderStatus {
    PENDING,
    DELIVERED,
    COMPLETED,
    CANCELLED;

    @JsonCreator
    public static PurchaseOrderStatus fromString(String key) throws InvalidFormatException {
        if (key == null)
            return null;
        try {
            return PurchaseOrderStatus.valueOf(key.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw InvalidFormatException.from(
                null,
                "Invalid value for PurchaseOrderStatus",
                key,
                PurchaseOrderStatus.class
            );
        }
    }
}
