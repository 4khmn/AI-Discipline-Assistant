package akhm.project.habit.service;

import akhm.project.habit.dto.HabitReportMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaProducerService {

    private final KafkaTemplate<String, HabitReportMessage> kafkaTemplate;
    private static final String HABIT_REPORT_TOPIC = "habit-events";

    public void sendHabitReport(HabitReportMessage message) {
        log.info("Sending habit report message for user id: {} to Kafka topic: {}", message.userId(), HABIT_REPORT_TOPIC);
        kafkaTemplate.send(HABIT_REPORT_TOPIC, message);
        log.info("Successfully sent habit report message for user id: {} to Kafka topic: {}", message.userId(), HABIT_REPORT_TOPIC);
    }
}
