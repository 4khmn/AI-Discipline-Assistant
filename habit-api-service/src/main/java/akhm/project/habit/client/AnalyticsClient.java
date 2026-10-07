package akhm.project.habit.client;

import akhm.project.habit.dto.HabitRecommendationResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "ai-analytics-service", url = "${app.ai-service.url:http://ai-analytics-service:8080}")
public interface AnalyticsClient {

    @GetMapping("/api/ai/recommendations/user/{userId}")
    List<HabitRecommendationResponse> getRecommendationsByUserId(@PathVariable("userId") Long userId);
}
