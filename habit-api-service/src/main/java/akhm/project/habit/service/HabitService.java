package akhm.project.habit.service;

import akhm.project.habit.dto.HabitReportMessage;
import akhm.project.habit.dto.HabitReportRequest;
import akhm.project.habit.entity.HabitRecommendation;
import akhm.project.habit.entity.User;
import akhm.project.habit.repository.HabitRecommendationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class HabitService {

    private final KafkaProducerService kafkaProducerService;
    private final HabitRecommendationRepository recommendationRepository;

    public void submitHabitReport(HabitReportRequest request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        log.info("Submitting habit report for user id: {}", user.getId());

        HabitReportMessage message = new HabitReportMessage(
                user.getId(),
                request.reportText(),
                Instant.now()
        );

        kafkaProducerService.sendHabitReport(message);
        log.info("Habit report sent to kafka for user id: {}", user.getId());
    }

    public List<HabitRecommendation> getUserRecommendations(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        log.info("Fetching AI recommendations for user id: {}", user.getId());
        return recommendationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }
}
