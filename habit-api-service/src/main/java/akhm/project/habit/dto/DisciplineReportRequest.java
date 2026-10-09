package akhm.project.habit.dto;

import akhm.project.habit.enums.Discipline;

import java.util.Map;

public record DisciplineReportRequest(
    Map<Discipline, Boolean> disciplines
) {}
