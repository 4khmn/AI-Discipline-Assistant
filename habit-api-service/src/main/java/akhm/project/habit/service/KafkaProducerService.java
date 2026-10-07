package akhm.project.habit.service;

import akhm.project.habit.dto.HabitReportMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KafkaProducerService {

    private final KafkaTemplate<String, HabitReportMessage> kafkaTemplate;
    private static final String HABIT_REPORT_TOPIC = "habit-events";

    public void sendHabitReport(HabitReportMessage message) {
        kafkaTemplate.send(HABIT_REPORT_TOPIC, message);
    }
}
