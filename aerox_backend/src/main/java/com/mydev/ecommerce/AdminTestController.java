package com.mydev.ecommerce;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin-test")
public class AdminTestController {

    @GetMapping
    public String test(){
        return "admin test works";
    }
}