package akhm.project.habit.dto;

import akhm.project.habit.enums.Discipline;

import java.time.LocalDate;
import java.util.Map;

public record DisciplineReportRequest(
    LocalDate date,
    Map<Discipline, Boolean> disciplines
) {}
