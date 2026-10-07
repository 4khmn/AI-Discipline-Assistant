package akhm.project.ai.repository;

import akhm.project.ai.entity.HabitRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HabitRecommendationRepository extends JpaRepository<HabitRecommendation, Long> {
}
