package com.campusconnect.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class testcontroller {

    @GetMapping("/")
    public String home() {
        return "Backend is LIVE 🚀";
    }
}