package akhm.project.habit.dto;

import java.time.Instant;

public record HabitReportMessage(
        Long userId,
        String reportText,
        Instant timestamp
) {
}
