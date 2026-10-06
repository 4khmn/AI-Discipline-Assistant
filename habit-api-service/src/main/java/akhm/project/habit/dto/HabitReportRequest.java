package akhm.project.habit.dto;

import jakarta.validation.constraints.NotBlank;

public record HabitReportRequest(
        @NotBlank(message = "Report text is required")
        String reportText
) {
}
