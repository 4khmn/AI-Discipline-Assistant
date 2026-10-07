package akhm.project.ai.listener;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class HabitEventListener {

    /**
     * Основной метод-слушатель сообщений из Kafka.
     *
     * @param record полный объект записи Kafka с метаданными
     * @param payload содержимое сообщения (JSON или String)
     * @param partition номер партиции, откуда пришло сообщение
     * @param offset смещение (offset) сообщения в партиции
     */
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
            // Здесь вызывается бизнес-логика обработки события
            processEvent(record.key(), payload);

            log.info("Successfully processed message with key: {}", record.key());
        } catch (Exception e) {
            log.error("Error processing Kafka message from topic {} at offset {}: {}",
                    record.topic(), offset, e.getMessage(), e);
            // При необходимости бросаем исключение дальше для срабатывания Retry / Dead Letter Queue (DLQ)
            throw e;
        }
    }

    private void processEvent(String key, String payload) {
        // Логика обработки события (например, отправка в Spring AI или сохранение аналитики)
        log.debug("Processing payload for key: {}", key);
    }
}