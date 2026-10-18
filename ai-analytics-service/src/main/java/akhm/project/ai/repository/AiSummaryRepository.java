package akhm.project.ai.repository;

import akhm.project.ai.entity.AiSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AiSummaryRepository extends JpaRepository<AiSummary, Long> {

    AiSummary findByUserId(Long userId);

    Boolean existsByUserId(Long userId);
}
