FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn
COPY habit-api-service/pom.xml habit-api-service/
COPY ai-analytics-service/pom.xml ai-analytics-service/
RUN mvn dependency:go-offline -B -pl habit-api-service -am
COPY habit-api-service/src habit-api-service/src
RUN mvn clean package -DskipTests -pl habit-api-service

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/habit-api-service/target/habit-api-service-*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
