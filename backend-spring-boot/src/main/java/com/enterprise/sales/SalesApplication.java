package com.enterprise.sales;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

/**
 * AI-Powered Sales Data Analysis and Visualization System
 * Spring Boot Application Entry Point
 */
@SpringBootApplication
@EnableConfigurationProperties
public class SalesApplication {

    public static void main(String[] args) {
        SpringApplication.run(SalesApplication.class, args);
    }
}
