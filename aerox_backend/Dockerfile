
FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml .

COPY src ./src

RUN mvn -B clean package -DskipTests

RUN JAR_FILE=$(ls target/*.jar | grep -v original | head -n 1) && cp "$JAR_FILE" app.jar

FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=build /app/app.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]