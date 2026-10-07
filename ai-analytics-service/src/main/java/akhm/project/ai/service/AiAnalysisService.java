package akhm.project.ai.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiAnalysisService {

    private final ChatModel chatModel;

    public String analyzeHabitData(String habitPayload) {
        log.info("Отправка данных трекинга в Gemini через Spring AI...");

        String template = """
                Ты — профессиональный AI-коуч по формированию полезных привычек и самодисциплине.
                
                Ниже представлены данные отчёта пользователя по привычке в формате JSON/текста:
                {habitData}
                
                На основе этих данных сделай следующее:
                1. Проанализируй текущий прогресс и регулярность.
                2. Дай 2-3 коротких, практичных и мотивирующих совета на русском языке.
                3. Держи ответ лаконичным, без лишней "воды".
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
}
