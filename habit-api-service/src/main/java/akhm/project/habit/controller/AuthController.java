package akhm.project.habit.controller;

import akhm.project.habit.dto.AuthResponse;
import akhm.project.habit.dto.LoginRequest;
import akhm.project.habit.dto.RegisterRequest;
import akhm.project.habit.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Received register request for username: {}", request.getUsername());
        AuthResponse response = authService.register(request);
        log.info("Successfully registered user: {}", request.getUsername());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("Received login request for username: {}", request.getUsername());
        AuthResponse response = authService.login(request);
        log.info("Successfully logged in user: {}", request.getUsername());
        return ResponseEntity.ok(response);
    }
}
