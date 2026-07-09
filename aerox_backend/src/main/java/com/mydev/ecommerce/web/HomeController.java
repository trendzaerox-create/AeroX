package com.mydev.ecommerce.web;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    private final JdbcTemplate jdbcTemplate;

    public HomeController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/")
    public String home() {
        return "API is running ✅";
    }

    @GetMapping("/ping")
    public String ping() {
        return "pong";
    }

    // ✅ ADD THIS
    @GetMapping("/warmup")
    public String warmup() {
        jdbcTemplate.queryForObject("SELECT 1", Integer.class);
        return "warm";
    }
}