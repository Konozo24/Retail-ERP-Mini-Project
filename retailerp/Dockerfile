# Use Maven + JDK for building and running
FROM maven:3.9.3-eclipse-temurin-17

WORKDIR /app

# Copy only pom.xml first to cache dependencies
COPY pom.xml .

# Expose Spring Boot default port
EXPOSE 8080

# Default command to run Spring Boot app
CMD ["mvn", "spring-boot:run"]
