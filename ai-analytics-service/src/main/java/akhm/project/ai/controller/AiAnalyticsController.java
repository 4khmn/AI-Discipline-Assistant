package akhm.project.ai.controller;

import akhm.project.ai.dto.HabitRecommendationResponse;
import akhm.project.ai.entity.HabitRecommendation;
import akhm.project.ai.repository.HabitRecommendationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/ai/recommendations")
@RequiredArgsConstructor
public class AiAnalyticsController {

    private final HabitRecommendationRepository recommendationRepository;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<HabitRecommendationResponse>> getRecommendationsByUserId(@PathVariable Long userId) {
        log.info("Received request to fetch recommendations for user id: {}", userId);
        List<HabitRecommendation> recommendations = recommendationRepository.findByUserIdOrderByCreatedAtDesc(userId);

        List<HabitRecommendationResponse> responseList = recommendations.stream()
                .map(rec -> HabitRecommendationResponse.builder()
                        .id(rec.getId())
                        .userId(rec.getUserId())
                        .habitId(rec.getHabitId())
                        .userInput(rec.getUserInput())
                        .recommendationText(rec.getRecommendationText())
                        .aiResponseDurationMs(rec.getAiResponseDurationMs())
                        .createdAt(rec.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        log.info("Found {} recommendations for user id: {}", responseList.size(), userId);
        return ResponseEntity.ok(responseList);
    }
}
