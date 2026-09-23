# ---- Build stage ----
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Cache dependencies separately from source changes.
COPY pom.xml .
RUN mvn -B dependency:go-offline

COPY src ./src
RUN mvn -B clean package -DskipTests

# ---- Runtime stage ----
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

RUN addgroup -S khelp && adduser -S khelp -G khelp

COPY --from=build /app/target/*.jar app.jar

USER khelp
EXPOSE 8080

ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
