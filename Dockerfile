FROM eclipse-temurin:21 AS BUILD
COPY . /app/
WORKDIR /app/
RUN ./mvnw clean package -Pproduction

FROM eclipse-temurin:21-jre
COPY --from=BUILD /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
