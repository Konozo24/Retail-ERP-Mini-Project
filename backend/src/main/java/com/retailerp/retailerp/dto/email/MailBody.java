package com.retailerp.retailerp.dto.email;

import lombok.Builder;

@Builder
public record MailBody(String to, String subject, String text) {

}