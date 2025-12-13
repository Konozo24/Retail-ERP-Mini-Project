# Use Maven + JDK for building and running
FROM maven:3.9-eclipse-temurin-21-alpine

EXPOSE 8080

WORKDIR /app
COPY pom.xml .
COPY src ./src

CMD ["mvn", "-Dspring.devtools.restart.enabled=false", "spring-boot:run"]

FROM maven:3.9-eclipse-temurin-21-alpine

WORKDIR /app

CMD ["mvn", "-Dspring.devtools.restart.enabled=false", "spring-boot:run"]
