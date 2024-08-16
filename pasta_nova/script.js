document.addEventListener('DOMContentLoaded', function () {
    const monthYearElement = document.getElementById('monthYear');
    const calendarBody = document.getElementById('calendarBody');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    const reminderModal = document.getElementById('reminderModal');
    const closeModal = document.getElementById('closeModal');
    const reminderInput = document.getElementById('reminderInput');
    const saveReminderButton = document.getElementById('saveReminder');

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let selectedDate = null;
    let reminders = JSON.parse(localStorage.getItem('reminders')) || {};
    let holidays = {
        '2024-1-1': 'Ano Novo',
        '2024-2-12': 'Carnaval',
        '2024-4-21': 'Tiradentes',
        '2024-5-1': 'Dia do Trabalho',
        '2024-9-7': 'Independência do Brasil',
        '2024-10-12': 'Nossa Senhora Aparecida',
        '2024-11-2': 'Finados',
        '2024-11-15': 'Proclamação da República',
        '2024-12-25': 'Natal'
    };

    function renderCalendar(month, year) {
        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();

        calendarBody.innerHTML = '';
        monthYearElement.textContent = `${monthNames[month]} ${year}`;

        for (let i = 0; i < firstDay; i++) {
            calendarBody.innerHTML += '<div class="day"></div>';
        }

        for (let day = 1; day <= lastDate; day++) {
            const dateKey = `${year}-${month + 1}-${day}`;
            const isHoliday = holidays[dateKey] ? 'holiday' : '';
            const hasReminder = reminders[dateKey] ? 'reminder' : '';
            calendarBody.innerHTML += `
                <div class="day ${isHoliday} ${hasReminder}" data-date="${dateKey}">
                    ${day}
                    ${isHoliday ? `<div class="tooltip">${holidays[dateKey]}</div>` : ''}
                </div>
            `;
        }

        document.querySelectorAll('.day').forEach(dayElement => {
            dayElement.addEventListener('click', function () {
                selectedDate = this.getAttribute('data-date');
                reminderInput.value = reminders[selectedDate] || '';
                reminderModal.style.display = 'block';
            });
        });
    }

    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    prevButton.addEventListener('click', function () {
        if (currentMonth === 0) {
            currentMonth = 11;
            currentYear--;
        } else {
            currentMonth--;
        }
        renderCalendar(currentMonth, currentYear);
    });

    nextButton.addEventListener('click', function () {
        if (currentMonth === 11) {
            currentMonth = 0;
            currentYear++;
        } else {
            currentMonth++;
        }
        renderCalendar(currentMonth, currentYear);
    });

    saveReminderButton.addEventListener('click', function () {
        const reminderText = reminderInput.value.trim();
        if (selectedDate && reminderText) {
            reminders[selectedDate] = reminderText;
            localStorage.setItem('reminders', JSON.stringify(reminders));
            renderCalendar(currentMonth, currentYear);
            reminderModal.style.display = 'none';
        }
    });

    closeModal.addEventListener('click', function () {
        reminderModal.style.display = 'none';
    });

    window.onclick = function(event) {
        if (event.target === reminderModal) {
            reminderModal.style.display = 'none';
        }
    };

    renderCalendar(currentMonth, currentYear);
});
