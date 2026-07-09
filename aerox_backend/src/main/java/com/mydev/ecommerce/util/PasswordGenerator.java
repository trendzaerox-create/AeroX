package com.mydev.ecommerce.util;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class PasswordGenerator implements CommandLineRunner {

    private final PasswordEncoder passwordEncoder;

    public PasswordGenerator(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {

        System.out.println("ADMIN HASH:");
        System.out.println(passwordEncoder.encode("admin123"));

        System.out.println("CUSTOMER HASH:");
        System.out.println(passwordEncoder.encode("customer123"));

    }
}