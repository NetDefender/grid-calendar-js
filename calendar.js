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
    let currentYear = options.currentYear;
    const localization = getLocalization();
    const calendar = document.getElementById(options.elementId);
    calendar.classList.add('calendar');

    const header = document.createElement('div');
    header.classList.add('calendar-header');
    const months = document.createElement('div');
    months.classList.add('calendar-months');
    calendar.appendChild(header);
    calendar.appendChild(months);

    createHeader();
    createMonths(currentYear);

    if (options.onDayClick) {
        const calendarDays = document.querySelector(`#${options.elementId}`);
        calendarDays.addEventListener('click', function (e) {
            if (e.target.classList.contains('calendar-day-not-empty')) {
                const date = new Date(e.target.dataset.year, e.target.dataset.month, e.target.dataset.day);
                date.setHours(0, 0, 0, 0);
                if (options.onDayClick) {
                    options.onDayClick(e.target, date);
                }
            }
        })
    }

    function createHeader() {
        header.addEventListener('click', function (e) {
            if (e.target.classList.contains('calendar-year')) {
                const previousYear = currentYear;
                currentYear = parseInt(e.target.dataset.year);
                const yearSelected = this.querySelector('.calendar-year-selected');
                if (yearSelected) {
                    yearSelected.classList.remove('calendar-year-selected');
                }
                this.querySelector(`[data-year="${currentYear}"]`).classList.add('calendar-year-selected');
                createMonths(currentYear);
                if (options.onYearChanged) {
                    options.onYearChanged(previousYear, currentYear);
                }
            }
        })
        for (let year = options.minYear; year <= options.maxYear; year++) {
            header.appendChild(createYear(year));
        }
    }

    function createYear(year) {
        const yearContainer = document.createElement('div');
        yearContainer.classList.add('calendar-year');
        yearContainer.dataset.year = year;
        yearContainer.textContent = year;
        if (currentYear === year) {
            yearContainer.classList.add('calendar-year-selected');
        }
        return yearContainer;
    }

    function createMonths(year) {
        months.textContent = '';
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
        const paddingStartDays = createMonthPaddingStart(day.getDay());
        paddingStartDays.forEach(paddingDay => daysContainer.appendChild(paddingDay));

        while (day.getMonth() === month) {
            daysContainer.appendChild(createDay(day));
            day.setDate(day.getDate() + 1);
        }
        day.setDate(day.getDate() - 1);
        const paddingEndDays = createMonthPaddingEnd(paddingStartDays.length, day);
        paddingEndDays.forEach(paddingDay => daysContainer.appendChild(paddingDay));

        return daysContainer;
    }

    function createMonthPaddingStart(day) {
        const paddingDays = [];
        let count = day - 1;

        if (count < 0) {
            count = 6;
        }

        for (let i = 0; i < count; i++) {
            const paddingDay = document.createElement('div');
            paddingDay.classList.add('calendar-day');
            paddingDay.textContent = ' ';
            paddingDays.push(paddingDay);
        }

        return paddingDays;
    }

    /**
     * 
     * @param {number} paddingStartCount 
     * @param {Date} day 
     */
    function createMonthPaddingEnd(paddingStartCount, day) {
        const paddingDays = [];
        const totalDays = day.getDate() + paddingStartCount;
        let rows = Math.floor(totalDays / 7);
        const remainder = totalDays % 7;

        console.log(rows);
        for (let i = 0; i < 7 - remainder; i++) {
            const paddingDay = document.createElement('div');
            paddingDay.classList.add('calendar-day');
            paddingDay.textContent = ' ';
            paddingDays.push(paddingDay);
        }

        for (let i = rows + 1; i < 6; i++) {
            for (let j = 0; j < 7; j++) {
                const paddingDay = document.createElement('div');
                paddingDay.classList.add('calendar-day');
                paddingDay.textContent = ' ';
                paddingDays.push(paddingDay);
            }
        }

        //console.log(totalDays, rows, day.getMonth(), paddingDays.length)

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