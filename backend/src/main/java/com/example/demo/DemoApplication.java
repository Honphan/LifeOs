package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication(excludeName = {
        "org.springframework.modulith.events.mongodb.MongoDbTransactionAutoConfiguration",
        "org.springframework.modulith.events.mongodb.MongoDbEventPublicationAutoConfiguration"
})
@EnableMongoAuditing
@EnableJpaAuditing
public class DemoApplication {

    public static void main(String[] args) {
        System.out.println("MYSQL_URL exists = " + (System.getenv("MYSQL_URL") != null));
        System.out.println("SPRING_DATASOURCE_URL exists = " + (System.getenv("SPRING_DATASOURCE_URL") != null));
        System.out.println("SPRING_DATASOURCE_DRIVER_CLASS_NAME = " + System.getenv("SPRING_DATASOURCE_DRIVER_CLASS_NAME"));
        System.out.println("MONGODB_URI exists = " + (System.getenv("MONGODB_URI") != null));
        System.out.println("REDIS_HOST exists = " + (System.getenv("REDIS_HOST") != null));
        SpringApplication.run(DemoApplication.class, args);
    }
}