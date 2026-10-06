FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn
COPY habit-api-service/pom.xml habit-api-service/
COPY ai-analytics-service/pom.xml ai-analytics-service/
RUN mvn dependency:go-offline -B -pl ai-analytics-service -am
COPY ai-analytics-service/src ai-analytics-service/src
RUN mvn clean package -DskipTests -pl ai-analytics-service

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/ai-analytics-service/target/ai-analytics-service-*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
