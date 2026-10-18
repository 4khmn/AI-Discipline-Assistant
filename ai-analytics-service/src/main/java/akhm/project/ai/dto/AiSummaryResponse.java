package akhm.project.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiSummaryResponse {
    private Long id;
    private Long userId;
    private String summaryText;
    private Integer totalAnalyzed;
    private LocalDateTime createdAt;
}
