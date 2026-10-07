package akhm.project.ai.controller;

import akhm.project.ai.dto.HabitRecommendationResponse;
import akhm.project.ai.service.AiAnalysisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/ai/recommendations")
@RequiredArgsConstructor
public class AiAnalyticsController {

    private final AiAnalysisService aiAnalysisService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<HabitRecommendationResponse>> getRecommendationsByUserId(@PathVariable Long userId) {
        log.info("Received request to fetch recommendations for user id: {}", userId);
        List<HabitRecommendationResponse> responseList = aiAnalysisService.getRecommendationsByUserId(userId);
        return ResponseEntity.ok(responseList);
    }
}
