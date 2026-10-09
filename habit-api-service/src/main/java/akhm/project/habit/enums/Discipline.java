package akhm.project.habit.enums;

public enum Discipline {
    WATER_2L("2 литра воды"),
    WORKOUT("Тренировка"),
    RUNNING("Бег"),
    STEPS_10K("10к шагов"),
    OUTDOOR_WALK("Прогулка на воздухе"),
    LEETCODE("Литкод");

    private final String displayName;

    Discipline(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
