# FROM maven:3.9.9-eclipse-temurin-21 AS build
# WORKDIR /app
# COPY . .
# RUN mvn clean package -DskipTests

# FROM eclipse-temurin:21-jdk
# WORKDIR /app
# COPY --from=build /app/target/*.jar app.jar

# EXPOSE 8080

# CMD ["java","-jar","app.jar"]










# Use Maven 3.9.9 with Eclipse Temurin JDK 21 as the build stage
# This stage is used to compile and package the Spring Boot application
FROM maven:3.9.9-eclipse-temurin-21 AS build

# Set the working directory inside the container to /app
WORKDIR /app

# Copy the Maven project file into the container
COPY pom.xml .

# Copy the source code folder into the container
COPY src ./src

# Build the Spring Boot project using Maven
# -B means batch mode, useful for Docker builds
# clean removes old build files
# package creates the JAR file
# -DskipTests skips running tests during build
RUN mvn -B clean package -DskipTests

# Find the generated JAR file inside target/
# Exclude files containing "original"
# Take the first matching JAR file
# Copy it as app.jar for easier use in the final stage
RUN JAR_FILE=$(ls target/*.jar | grep -v original | head -n 1) && cp "$JAR_FILE" app.jar

# Use a lightweight Java 21 runtime image for running the app
# This does not include Maven, only Java runtime
FROM eclipse-temurin:21-jre

# Set the working directory inside the final container
WORKDIR /app

# Copy app.jar from the build stage into the final container
COPY --from=build /app/app.jar app.jar

# Inform Docker that the Spring Boot app runs on port 8080
EXPOSE 8080

# Command to start the Spring Boot application
CMD ["java", "-jar", "app.jar"]