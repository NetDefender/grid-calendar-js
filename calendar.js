/**
* @typedef CalendarOptions
 * @type {object}
 * @property {string} elementId - id of the container of the calendar
 * @property {string} lang - language of the calendar
 * @property {number} minYear - minimum year of the calendar
 * @property {number} maxYear - maximum year of the calendar
 * @property {number} currentYear - current year of the calendar
 * @property {Function} onRenderDay - function adjust the style of the calendar
 * @property {Function} onRenderDayLabel - function adjust the style of the day of the week labels
 * @property {Function} onDayClick - function that click a day
 */

/**
 * @param {CalendarOptions} options 
 */
function createCalendar(options) {
    const localization = getLocalization();
    const calendar = document.getElementById(options.elementId);
    calendar.classList.add('calendar');

    const header = document.createElement('div');
    header.classList.add('calendar-header');
    const months = document.createElement('div');
    months.classList.add('calendar-months');

    createMonths(options.currentYear);

    calendar.appendChild(header);
    calendar.appendChild(months);

    if (options.onDayClick) {
        const calendarDays = document.querySelector(`#${options.elementId}`);
        calendarDays.addEventListener('click', function (e) {
            if (e.target.classList.contains('calendar-day')) {
                const date = new Date(e.target.dataset.year, e.target.dataset.month, e.target.dataset.day);
                date.setHours(0, 0, 0, 0);
                options.onDayClick(e.target, date);
            }
        })
    }

    function createMonths(year) {
        for (let i = 0; i < 12; i++) {
            months.appendChild(createMonth(year, i));
        }
    }

    function createMonth(year, month) {
        const monthContainer = document.createElement('div');
        monthContainer.classList.add('calendar-month');
        monthContainer.appendChild(createMonthHeader(month));
        monthContainer.appendChild(createMonthDaysLabels())
        monthContainer.appendChild(createMonthDays(year, month));

        return monthContainer;
    }

    function createMonthHeader(month) {
        const monthHeader = document.createElement('div');
        monthHeader.classList.add('calendar-month-header');
        const monthHeaderSpan = document.createElement('span');
        monthHeaderSpan.textContent = localization[options.lang].months.get(month);
        monthHeader.appendChild(monthHeaderSpan);
        return monthHeader;
    }

    function createMonthDaysLabels() {
        const daysLabels = document.createElement('div');
        daysLabels.classList.add('calendar-days-labels');

        for (let i = 1; i <= 7; i++) {
            const dayIndex = i % 7;
            const dayLabel = document.createElement('div');
            dayLabel.classList.add('calendar-day-label');
            dayLabel.textContent = localization[options.lang].daysOfWeek.get(dayIndex);
            if (options.onRenderDayLabel) {
                options.onRenderDayLabel(dayLabel, dayIndex);
            }
            daysLabels.appendChild(dayLabel);
        }

        return daysLabels;
    }

    function createMonthDays(year, month) {
        const daysContainer = document.createElement('div');
        daysContainer.classList.add('calendar-days');
        const day = new Date(year, month, 1);
        createMonthPadding(day.getDay()).forEach(paddingDay => daysContainer.appendChild(paddingDay));

        while (day.getMonth() === month) {
            daysContainer.appendChild(createDay(day));
            day.setDate(day.getDate() + 1);
        }

        return daysContainer;
    }

    function createMonthPadding(day) {
        const paddingDays = [];
        let count = day - 1;

        if (count < 0) {
            count = 6;
        }

        for (let i = 0; i < count; i++) {
            const paddingDay = document.createElement('div');
            paddingDay.classList.add('calendar-day');
            paddingDays.push(paddingDay);
        }

        return paddingDays;
    }

    function createDay(date) {
        const dayContainer = document.createElement('div');
        dayContainer.classList.add('calendar-day');
        dayContainer.classList.add('calendar-day-not-empty');
        dayContainer.dataset.month = date.getMonth();
        dayContainer.dataset.day = date.getDate();
        dayContainer.dataset.year = date.getFullYear();
        dayContainer.textContent = date.getDate();
        if (options.onRenderDay) {
            options.onRenderDay(dayContainer, date);
        }
        return dayContainer;
    }

    function getLocalization() {
        return {
            es: {
                months: new Map([
                    [0, 'Enero'],
                    [1, 'Febrero'],
                    [2, 'Marzo'],
                    [3, 'Abril'],
                    [4, 'Mayo'],
                    [5, 'Junio'],
                    [6, 'Julio'],
                    [7, 'Agosto'],
                    [8, 'Septiembre'],
                    [9, 'Octubre'],
                    [10, 'Noviembre'],
                    [11, 'Diciembre']
                ]),
                daysOfWeek: new Map([
                    [0, 'Dom'],
                    [1, 'Lun'],
                    [2, 'Mar'],
                    [3, 'Mie'],
                    [4, 'Jue'],
                    [5, 'Vie'],
                    [6, 'Sab']
                ])
            }
        };
    }
}