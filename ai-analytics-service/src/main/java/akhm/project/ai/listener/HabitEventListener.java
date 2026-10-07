package akhm.project.ai.listener;

import akhm.project.ai.dto.HabitReportMessage;
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

import java.time.LocalDateTime;

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
            ConsumerRecord<String, HabitReportMessage> record,
            @Payload HabitReportMessage message,
            @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
            @Header(KafkaHeaders.OFFSET) long offset
    ) {
        log.info("Received Kafka message from topic: {}, partition: {}, offset: {}, key: {}", 
                record.topic(), partition, offset, record.key());

        try {
            processEvent(record.key(), message);
            log.info("Successfully processed message with key: {}", record.key());
        } catch (Exception e) {
            log.error("Error processing Kafka message from topic {} at offset {}: {}",
                    record.topic(), offset, e.getMessage(), e);
            throw e;
        }
    }

    private void processEvent(String key, HabitReportMessage message) {
        long startTime = System.currentTimeMillis();
        String aiAdvice = aiAnalysisService.analyzeHabitData(message.getReportText());
        long durationMs = System.currentTimeMillis() - startTime;

        log.info("AI analysis completed for report key: {}, duration: {} ms", key, durationMs);

        HabitRecommendation recommendation = HabitRecommendation.builder()
                .userId(message.getUserId() != null ? message.getUserId() : 1L)
                .userInput(message.getReportText())
                .recommendationText(aiAdvice)
                .aiResponseDurationMs(durationMs)
                .createdAt(LocalDateTime.now())
                .build();

        recommendationRepository.save(recommendation);
        log.info("Saved AI recommendation to database for user id: {}", message.getUserId());
    }
}
