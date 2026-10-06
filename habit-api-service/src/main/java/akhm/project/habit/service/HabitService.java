package akhm.project.habit.service;

import akhm.project.habit.dto.HabitReportMessage;
import akhm.project.habit.dto.HabitReportRequest;
import akhm.project.habit.dto.HabitReportResponse;
import akhm.project.habit.entity.User;
import akhm.project.habit.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class HabitService {

    private final KafkaProducerService kafkaProducerService;
    private final UserRepository userRepository;

    public HabitReportResponse submitHabitReport(HabitReportRequest request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();

        HabitReportMessage message = new HabitReportMessage(
                user.getId(),
                request.reportText(),
                Instant.now()
        );

        kafkaProducerService.sendHabitReport(message);

        return new HabitReportResponse("ACCEPTED", "Отчет принят и отправлен на AI-анализ");
    }
}
