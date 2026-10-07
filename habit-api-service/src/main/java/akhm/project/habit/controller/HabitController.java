package akhm.project.habit.controller;

import akhm.project.habit.dto.HabitReportRequest;
import akhm.project.habit.dto.HabitReportResponse;
import akhm.project.habit.service.HabitService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/habits")
@RequiredArgsConstructor
public class HabitController {

    private final HabitService habitService;

    @PostMapping("/report")
    public ResponseEntity<HabitReportResponse> submitReport(
            @Valid @RequestBody HabitReportRequest request,
            Authentication authentication) {
        String username = authentication != null ? authentication.getName() : "unknown";
        log.info("Received habit report submission for user: {}", username);
        HabitReportResponse response = habitService.submitHabitReport(request, authentication);
        log.info("Successfully submitted habit report for user: {}", username);
        return ResponseEntity.ok(response);
    }
}
