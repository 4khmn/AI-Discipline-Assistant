package akhm.project.ai.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Controller {

    @GetMapping("/api/ai")
    public String hello() {
        return "Hello from AI Analytics Service";
    }
}
