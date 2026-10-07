package akhm.project.ai.listener;

import akhm.project.ai.entity.HabitRecommendation;
import akhm.project.ai.repository.HabitRecommendationRepository;
import akhm.project.ai.service.AiAnalysisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Slf4j
@Component
@RequiredArgsConstructor
public class HabitEventListener {

    private final AiAnalysisService aiAnalysisService;
    private final HabitRecommendationRepository recommendationRepository;

    @KafkaListener(
            topics = "${app.kafka.topics.habit-events:habit-events}",
            groupId = "${spring.kafka.consumer.group-id:ai-analytics-group}"
    )
    public void handleHabitEvent(
            ConsumerRecord<String, String> record,
            @Payload String payload,
            @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
            @Header(KafkaHeaders.OFFSET) long offset
    ) {
        log.info("=================== KAFKA MESSAGE RECEIVED ===================");
        log.info("Topic: {}", record.topic());
        log.info("Partition: {}", partition);
        log.info("Offset: {}", offset);
        log.info("Key: {}", record.key());
        log.info("Payload: {}", payload);
        log.info("Timestamp: {}", record.timestamp());
        log.info("==============================================================");

        try {
            processEvent(record.key(), payload);

            log.info("Successfully processed message with key: {}", record.key());
        } catch (Exception e) {
            log.error("Error processing Kafka message from topic {} at offset {}: {}",
                    record.topic(), offset, e.getMessage(), e);
            throw e;
        }
    }

    private void processEvent(String key, String payload) {
        String aiAdvice = aiAnalysisService.analyzeHabitData(payload);

        log.info("=================== GEMINI AI ANALYSIS ===================");
        log.info("Ключ отчёта: {}", key);
        log.info("Рекомендация ИИ:\n{}", aiAdvice);
        log.info("==========================================================");

        HabitRecommendation recommendation = HabitRecommendation.builder()
                .reportText(payload)
                .recommendation(aiAdvice)
                .createdAt(Instant.now())
                .build();

        recommendationRepository.save(recommendation);
        log.info("Сохранена рекомендация ИИ в базу данных для ключа: {}", key);
    }
}
