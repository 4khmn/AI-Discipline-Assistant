package akhm.project.habit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HabitRecommendationResponse {
    private Long id;
    private Long userId;
    private Long habitId;
    private String userInput;
    private String recommendationText;
    private Long aiResponseDurationMs;
    private LocalDateTime createdAt;
}
