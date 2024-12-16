# syntax=docker/dockerfile:1

FROM openjdk:17

WORKDIR /app

COPY .mvn/ .mvn

COPY mvnw pom.xml ./

RUN ./mvnw dependency:resolve

COPY src ./src

ENV SPRING_PROFILES_ACTIVE=prod

CMD ["./mvnw", "spring-boot:run"]