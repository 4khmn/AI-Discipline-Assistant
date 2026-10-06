package akhm.project.habit.controller;

import akhm.project.habit.dto.HabitReportRequest;
import akhm.project.habit.dto.HabitReportResponse;
import akhm.project.habit.service.HabitService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/habits")
@RequiredArgsConstructor
public class HabitController {

    private final HabitService habitService;

    @PostMapping("/report")
    public ResponseEntity<HabitReportResponse> submitReport(
            @Valid @RequestBody HabitReportRequest request,
            Authentication authentication) {
        HabitReportResponse response = habitService.submitHabitReport(request, authentication);
        return ResponseEntity.ok(response);
    }
}
