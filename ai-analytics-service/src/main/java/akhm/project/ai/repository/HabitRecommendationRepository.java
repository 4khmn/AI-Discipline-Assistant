package akhm.project.ai.repository;

import akhm.project.ai.entity.HabitRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HabitRecommendationRepository extends JpaRepository<HabitRecommendation, Long> {
    List<HabitRecommendation> findByUserIdOrderByCreatedAtDesc(Long userId);
}
