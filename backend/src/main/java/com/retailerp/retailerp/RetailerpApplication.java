package com.retailerp.retailerp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.core.env.Environment;

@SpringBootApplication
public class RetailerpApplication {

	private static boolean browserOpened = false;

	public static void main(String[] args) {
		SpringApplication app = new SpringApplication(RetailerpApplication.class);

		app.addListeners((ApplicationListener<ApplicationReadyEvent>) event -> {
			if (!browserOpened) {
				Environment env = event.getApplicationContext().getEnvironment();
				String[] activeProfiles = env.getActiveProfiles();

				// Check if 'dev' profile is active
				boolean isDev = false;
				for (String profile : activeProfiles) {
					if ("dev".equals(profile)) {
						isDev = true;
						break;
					}
				}

				if (!isDev) { // Only open browser if NOT dev
					browserOpened = true;
					try {
						String url = "http://localhost:8080";
						String os = System.getProperty("os.name").toLowerCase();
						if (os.contains("win")) {
							new ProcessBuilder("cmd", "/c", "start", url).start();
						} else if (os.contains("mac")) {
							new ProcessBuilder("open", url).start();
						} else if (os.contains("nix") || os.contains("nux")) {
							new ProcessBuilder("xdg-open", url).start();
						}
					} catch (Exception e) {
						System.err.println("Failed to open browser: " + e.getMessage());
					}
				}
			}
		});

		app.run(args);
	}
}
