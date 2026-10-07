package akhm.project.habit.controller;

import akhm.project.habit.client.AnalyticsClient;
import akhm.project.habit.dto.HabitRecommendationResponse;
import akhm.project.habit.dto.HabitReportRequest;
import akhm.project.habit.entity.User;
import akhm.project.habit.service.HabitService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/habits")
@RequiredArgsConstructor
public class HabitController {

    private final HabitService habitService;
    private final AnalyticsClient analyticsClient;

    @PostMapping("/report")
    public ResponseEntity<Map<String, String>> submitReport(
            @Valid @RequestBody HabitReportRequest request,
            Authentication authentication) {
        String username = authentication != null ? authentication.getName() : "unknown";
        log.info("Received habit report submission for user: {}", username);
        habitService.submitHabitReport(request, authentication);
        log.info("Successfully submitted habit report for user: {}", username);
        return ResponseEntity.accepted().body(Map.of(
                "status", "ACCEPTED",
                "message", "Отчет принят и отправлен на AI-анализ"
        ));
    }

    @GetMapping("/recommendations")
    public ResponseEntity<List<HabitRecommendationResponse>> getRecommendations(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        log.info("Received request to fetch AI recommendations for user id: {}", user.getId());
        List<HabitRecommendationResponse> recommendations = analyticsClient.getRecommendationsByUserId(user.getId());
        log.info("Successfully fetched {} AI recommendations for user id: {}", recommendations.size(), user.getId());
        return ResponseEntity.ok(recommendations);
    }
}
