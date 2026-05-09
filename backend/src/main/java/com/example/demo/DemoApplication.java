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
        SpringApplication.run(DemoApplication.class, args);
    }
}