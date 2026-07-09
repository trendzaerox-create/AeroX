





package com.mydev.ecommerce;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@ComponentScan(basePackages = "com.mydev.ecommerce")
@EnableScheduling
public class MydevEcommerceApplication {

    public static void main(String[] args) {
        SpringApplication.run(MydevEcommerceApplication.class, args);
    }
}