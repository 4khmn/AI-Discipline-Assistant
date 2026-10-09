package akhm.project.habit.service;

import akhm.project.habit.dto.DisciplineReportRequest;
import akhm.project.habit.dto.HabitReportMessage;
import akhm.project.habit.dto.HabitReportRequest;
import akhm.project.habit.entity.User;
import akhm.project.habit.entity.UserDailyDiscipline;
import akhm.project.habit.enums.Discipline;
import akhm.project.habit.repository.UserDailyDisciplineRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class HabitService {

    private final KafkaProducerService kafkaProducerService;
    private final UserDailyDisciplineRepository disciplineRepository;

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

    public void submitDisciplineReport(DisciplineReportRequest request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        LocalDate targetDate = request.date() != null ? request.date() : LocalDate.now();
        log.info("Submitting discipline report for user id: {}, date: {}, disciplines: {}", user.getId(), targetDate, request.disciplines());

        UserDailyDiscipline dailyDiscipline = disciplineRepository
                .findByUserIdAndDisciplineDate(user.getId(), targetDate)
                .orElseGet(() -> UserDailyDiscipline.builder()
                        .userId(user.getId())
                        .disciplineDate(targetDate)
                        .build());

        Map<Discipline, Boolean> map = request.disciplines();
        if (map != null) {
            dailyDiscipline.setWater2l(map.getOrDefault(Discipline.WATER_2L, false));
            dailyDiscipline.setWorkout(map.getOrDefault(Discipline.WORKOUT, false));
            dailyDiscipline.setRunning(map.getOrDefault(Discipline.RUNNING, false));
            dailyDiscipline.setSteps10k(map.getOrDefault(Discipline.STEPS_10K, false));
            dailyDiscipline.setOutdoorWalk(map.getOrDefault(Discipline.OUTDOOR_WALK, false));
            dailyDiscipline.setLeetcode(map.getOrDefault(Discipline.LEETCODE, false));
        }

        disciplineRepository.save(dailyDiscipline);
        log.info("Discipline report successfully saved for user id: {}, date: {}", user.getId(), targetDate);
    }

    public List<UserDailyDiscipline> getDisciplinesHistory(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        log.info("Fetching discipline history for user id: {}", user.getId());
        return disciplineRepository.findByUserIdOrderByDisciplineDateDesc(user.getId());
    }

}
