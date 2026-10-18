package akhm.project.ai.mapper;

import akhm.project.ai.dto.AiSummaryResponse;
import akhm.project.ai.entity.AiSummary;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AiSummaryMapper {

    AiSummaryResponse toDto(AiSummary aiSummary);
}
