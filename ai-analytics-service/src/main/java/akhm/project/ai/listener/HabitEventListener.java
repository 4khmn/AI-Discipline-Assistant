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
        log.info("Start processing message with key: {}, offset: {}", record.key(), offset);

        try {
            processEvent(record.key(), message);
            log.info("Finished processing message with key: {}, offset: {}", record.key(), offset);
        } catch (Exception e) {
            log.error("Error processing Kafka message from topic {} at offset {}: {}",
                    record.topic(), offset, e.getMessage(), e);
            throw e;
        }
    }

    private void processEvent(String key, HabitReportMessage message) {
        long startTime = System.currentTimeMillis();
        AiAnalysisService.AiAnalysisResult result = aiAnalysisService.analyzeHabitData(message.getReportText());
        long durationMs = System.currentTimeMillis() - startTime;

        HabitRecommendation recommendation = HabitRecommendation.builder()
                .userId(message.getUserId() != null ? message.getUserId() : 1L)
                .userInput(message.getReportText())
                .recommendationText(result.text())
                .hasError(result.hasError())
                .aiResponseDurationMs(durationMs)
                .createdAt(LocalDateTime.now())
                .build();

        recommendationRepository.save(recommendation);
        aiAnalysisService.updateSummary(recommendation);
    }
}
