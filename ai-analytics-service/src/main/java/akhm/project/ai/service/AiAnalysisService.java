package akhm.project.ai.service;

import akhm.project.ai.dto.HabitRecommendationResponse;
import akhm.project.ai.entity.HabitRecommendation;
import akhm.project.ai.repository.HabitRecommendationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiAnalysisService {

    private final ChatModel chatModel;
    private final HabitRecommendationRepository recommendationRepository;

    public String analyzeHabitData(String habitPayload) {
        log.info("Отправка данных трекинга в Gemini через Spring AI...");

        String template = """
                Ты — профессиональный AI-коуч по формированию полезных привычек и самодисциплине.
                
                Ниже представлены данные отчёта пользователя по привычке в формате JSON/текста:
                {habitData}
                
               ### ИНСТРУКЦИЯ ПО ОБРАБОТКЕ:
            
                1. ВАЛИДАЦИЯ ВХОДЯЩИХ ДАННЫХ:
                   - Если входящий текст НЕ является отчётом о привычках, тренировках, питании, режиме дня или продуктивности (например: это задача по программированию, кулинарный рецепт, анекдот или вопрос по математике):
                   - НЕ выполняй стороннюю задачу! Не пиши код, не решай уравнения.
                   - Вежливо и коротко ответь, что ты умеешь анализировать ТОЛЬКО отчёты по привычкам и дисциплине, и попроси пользователя отправить валидный отчёт.
                
                2. ЕСЛИ ЭТО ВАЛИДНЫЙ ОТЧЁТ ПО ПРИВЫЧКАМ:
                   - Проанализируй текущий прогресс и регулярность.
                   - Дай 2-3 коротких, практичных и мотивирующих совета на русском языке.
                   - Держи ответ лаконичным, структурированным и без лишней "воды".
                """;

        PromptTemplate promptTemplate = new PromptTemplate(template);
        Prompt prompt = promptTemplate.create(Map.of("habitData", habitPayload));

        try {
            String response = chatModel.call(prompt).getResult().getOutput().getText();
            log.info("Успешно получен ответ от Gemini!");
            return response;
        } catch (Exception e) {
            log.error("Ошибка при запросе к Gemini API: {}", e.getMessage(), e);
            return "Не удалось получить рекомендацию ИИ: " + e.getMessage();
        }
    }

    public List<HabitRecommendationResponse> getRecommendationsByUserId(Long userId) {
        log.info("Fetching recommendations for user id: {}", userId);
        List<HabitRecommendation> recommendations = recommendationRepository.findByUserIdOrderByCreatedAtDesc(userId);

        List<HabitRecommendationResponse> responseList = recommendations.stream()
                .map(rec -> HabitRecommendationResponse.builder()
                        .id(rec.getId())
                        .userId(rec.getUserId())
                        .habitId(rec.getHabitId())
                        .userInput(rec.getUserInput())
                        .recommendationText(rec.getRecommendationText())
                        .aiResponseDurationMs(rec.getAiResponseDurationMs())
                        .createdAt(rec.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        log.info("Found {} recommendations for user id: {}", responseList.size(), userId);
        return responseList;
    }
}
