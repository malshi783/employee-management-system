#Stage 01
FROM maven:3.9-eclipse-temurin-25 AS build

WORKDIR /build
COPY pom.xml ./
COPY src ./src
RUN mvn -B -DskipTests package

#Stage 2
FROM eclipse-temurin:25-jre

WORKDIR /app
COPY --from=build /build/target/*.jar /app/app.jar
RUN mkdir -p /app/uploads

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]