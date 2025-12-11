# Stage 1: Build
FROM maven:3.9.3-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml ./
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run
FROM eclipse-temurin:21-jre-alpine
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","/app.jar"]

# cd retailerp
# ./mvnw package && java -jar target/demo-0.0.1-SNAPSHOT.jar (with gitbash)
# docker build -t retailerp/backend/image .
# docker run -d --name retailerp-backend -p 8080:8080 retailerp/backend/image
# docker container kill