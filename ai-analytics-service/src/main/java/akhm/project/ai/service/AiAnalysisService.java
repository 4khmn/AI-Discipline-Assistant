package akhm.project.ai.service;

import akhm.project.ai.dto.AiSummaryResponse;
import akhm.project.ai.dto.HabitRecommendationResponse;
import akhm.project.ai.entity.AiSummary;
import akhm.project.ai.entity.HabitRecommendation;
import akhm.project.ai.mapper.AiSummaryMapper;
import akhm.project.ai.repository.AiSummaryRepository;
import akhm.project.ai.repository.HabitRecommendationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AiAnalysisService {

    private final ChatModel chatModel;
    private final HabitRecommendationRepository recommendationRepository;
    private final AiSummaryRepository aiSummaryRepository;
    private final AiSummaryMapper mapper;

    public record AiAnalysisResult(String text, boolean hasError) {}

    public AiAnalysisResult analyzeHabitData(String habitPayload) {
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
            return new AiAnalysisResult(response, false);
        } catch (Exception e) {
            return new AiAnalysisResult("В данный момент ИИ-коуч временно недоступен или отклонил запрос. Пожалуйста, попробуйте позже.", true);
        }
    }

    public List<HabitRecommendationResponse> getRecommendationsByUserId(Long userId) {
        List<HabitRecommendation> recommendations = recommendationRepository.findByUserIdOrderByCreatedAtDesc(userId);

        return recommendations.stream()
                .map(rec -> HabitRecommendationResponse.builder()
                        .id(rec.getId())
                        .userId(rec.getUserId())
                        .habitId(rec.getHabitId())
                        .userInput(rec.getUserInput())
                        .recommendationText(rec.getRecommendationText())
                        .hasError(rec.isHasError())
                        .aiResponseDurationMs(rec.getAiResponseDurationMs())
                        .createdAt(rec.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    public void deleteRecommendation(Long id) {
        if (!recommendationRepository.existsById(id)) {
            throw new RuntimeException("Recommendation not found with id: " + id);
        }
        recommendationRepository.deleteById(id);
    }

    public AiSummaryResponse getAiSummaryByUserId(long userId) {
        AiSummary byUserId = aiSummaryRepository.findByUserId(userId);
        return mapper.toDto(byUserId);
    }

    public void updateSummary(HabitRecommendation recommendation){
        if (aiSummaryRepository.existsByUserId(recommendation.getUserId())) {
            AiSummary summary = aiSummaryRepository.findByUserId(recommendation.getUserId());
            String template = """
                    Ты — профессиональный AI-коуч по формированию полезных привычек.
                    Ниже приведены предыдущие рекомендации и отчеты пользователя:
                    {recommendations}
                    
                    Составь краткое итоговое резюме (summary) прогресса пользователя, выделив его сильные стороны и зоны роста на русском языке.
                    """;

            List<HabitRecommendation> recommendationsByUser = recommendationRepository
                    .findByUserIdOrderByCreatedAtDesc(recommendation.getUserId());
            PromptTemplate promptTemplate = new PromptTemplate(template);
            Prompt prompt = promptTemplate.create(Map.of("recommendations", recommendationsByUser));

            try {
                String response = chatModel.call(prompt).getResult().getOutput().getText();
                summary.setSummaryText(response);
                summary.setTotalAnalyzed(summary.getTotalAnalyzed()+1);
                aiSummaryRepository.save(summary);
            } catch (Exception ignored) {
            }
        }
        aiSummaryRepository.save(
                AiSummary.builder()
                        .userId(recommendation.getUserId())
                        .summaryText(recommendation.getRecommendationText())
                        .totalAnalyzed(1)
                        .build());
    }
}
