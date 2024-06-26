document.addEventListener('DOMContentLoaded', function () {
    console.log(location.search);
    createCalendar({
        elementId: 'calendar',
        lang: 'es',
        minYear: 2020,
        maxYear: 2050,
        currentYear: 2024,
        onRenderDay: function (dayContainer, date) {
            if (date.getDay() === 0 || date.getDay() === 6) {
                dayContainer.style.color = 'red';
            }
        },
        onRenderDayLabel: function (dayLabel, dayIndex) {
            dayLabel.style.color = '#64B5F6';
        },
        onDayClick: function (dayContainer, date) {
            dayContainer.classList.toggle('holiday');
            console.log(date);
        },
        onYearChanged: function (previousYear, currentYear) {
            console.log(previousYear, currentYear);
        }
    })
})