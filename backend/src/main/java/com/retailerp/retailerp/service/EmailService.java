package com.retailerp.retailerp.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.retailerp.retailerp.dto.email.MailBody;

@Service
public class EmailService {

	private final JavaMailSender javaMailSender;
	private final String mailFrom;

	public EmailService(JavaMailSender javaMailSender,
			@Value("${spring.mail.username}") String mailFrom) {
		this.javaMailSender = javaMailSender;
		this.mailFrom = mailFrom;
	}

	public void sendSimpleMessage(MailBody mailBody) {
		SimpleMailMessage message = new SimpleMailMessage();
		message.setTo(mailBody.to());
		message.setFrom(mailFrom);
		message.setSubject(mailBody.subject());
		message.setText(mailBody.text());

		javaMailSender.send(message);
	}

}
