const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const WEEK_DAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

class DatePicker {
  constructor(id) {
    this.element = document.getElementById(id);
    this.date = new Date();
    this.selectedDate = new Date();
  }

  populateDates() {
    this.daysElement.innerHTML = '';

    let month = this.date.getMonth();
    let year = this.date.getFullYear();
    let selectedDay = this.selectedDate.getDate();
    let selectedMonth = this.selectedDate.getMonth();
    let selectedYear = this.selectedDate.getFullYear();

    let amount_days = new Date(year, month + 1, 0).getDate();
    let curMonthFirstDayIndex = getLocalDay(new Date(year, month, 1));
    let lastDayMonthBefore = new Date(year, month, 0).getDate();
    let curMonthEndDayIndex = getLocalDay(new Date(year, month + 1, 0));
    let firstDayNextMonth = 1;

    for (let i = curMonthFirstDayIndex - 1; i >= 1; i--) {
      const dayElement = document.createElement('div');
      dayElement.classList.add('day', 'prev');
      dayElement.textContent = String(lastDayMonthBefore - i + 1);
      this.daysElement.appendChild(dayElement);

      dayElement.addEventListener('click', () => {
        this.selectedDate = new Date(year, month - 1, lastDayMonthBefore - i + 1);
        this.selectedDateElement.value = formatDate(this.selectedDate);
      });

      dayElement.addEventListener('click', goToPrevMonth.bind(this));
    }

    for (let i = 0; i < amount_days; i++) {
      const dayElement = document.createElement('div');
      dayElement.classList.add('day');
      dayElement.textContent = String(i + 1);

      if (selectedDay === (i + 1) && selectedYear === year && selectedMonth === month) {
        dayElement.classList.add('selected');
      }

      dayElement.addEventListener('click', () => {
        this.selectedDate = new Date(year, month, i + 1);
        this.selectedDateElement.value = formatDate(this.selectedDate);
        this.populateDates();
      });

      this.daysElement.appendChild(dayElement);
    }

    for (let i = curMonthEndDayIndex + 1; i <= 7; i++) {
      const dayElement = document.createElement('div');
      const dayNumber = firstDayNextMonth;
      dayElement.classList.add('day', 'next');
      dayElement.textContent = String(firstDayNextMonth++);
      this.daysElement.appendChild(dayElement);

      dayElement.addEventListener('click', () => {
        this.selectedDate = new Date(year, month + 1, dayNumber);
        this.selectedDateElement.value = formatDate(this.selectedDate);
      });

      dayElement.addEventListener('click', goToNextMonth.bind(this));
    }
  }

  render() {
    this.element.innerHTML = `
    <label><input class="selected-date" placeholder="DD.MM.YYYY" minlength="10" maxlength="10" type="text" pattern="(\\d{2}\\.){2}\\d{4}"></label>
    
    <div class="dates">
        <div class="month">
            <div class="arrows prev-mth">&lt;</div>
            <div class="mth"></div>
            <div class="arrows next-mth">&gt;</div>
        </div>
        <div class="weekDays"></div>
        <div class="days"></div>
    </div>
    `;

    this.selectedDateElement = this.element.querySelector(`.selected-date`);
    this.monthElement = this.element.querySelector(`.mth`);
    this.nextMonthElement = this.element.querySelector(`.next-mth`);
    this.prevMonthElement = this.element.querySelector(`.prev-mth`);
    this.daysElement = this.element.querySelector(`.days`);
    this.weekDays = this.element.querySelector(`.weekDays`);

    this.monthElement.textContent = MONTHS[this.selectedDate.getMonth()] + ' ' + this.selectedDate.getFullYear();
    this.selectedDateElement.value = formatDate(this.selectedDate);

    for (let dayName of WEEK_DAY_NAMES) {
      this.weekDays.innerHTML += `<div>${dayName}</div>`
    }

    this.selectedDateElement.addEventListener('input', handleChange.bind(this));
    this.nextMonthElement.addEventListener('click', goToNextMonth.bind(this));
    this.prevMonthElement.addEventListener('click', goToPrevMonth.bind(this));


    this.populateDates();
  }
}

//Functions
function goToNextMonth() {
  let month = this.date.getMonth() + 1;
  let year = this.date.getFullYear();
  if (month === 12) {
    month = 0;
    year++;
    this.date.setFullYear(year);
  }
  this.date.setMonth(month);
  this.monthElement.textContent = MONTHS[month] + ' ' + year;
  this.selectedDateElement.value = formatDate(this.selectedDate);
  this.populateDates();
}

function goToPrevMonth() {
  let month = this.date.getMonth()-1;
  let year = this.date.getFullYear();
  if (month === -1) {
    month = 11;
    year--;
    this.date.setFullYear(year);
  }
  this.date.setMonth(month);
  this.monthElement.textContent = MONTHS[month] + ' ' + year;
  this.selectedDateElement.value = formatDate(this.selectedDate);
  this.populateDates();
}

//Helper Functions
function formatDate(d) {
  let day = d.getDate();
  if (day < 10) {
    day = '0' + day;
  }

  let month = d.getMonth() + 1;
  if (month < 10) {
    month = '0' + month;
  }

  let year = d.getFullYear();

  return day + '.' + month + '.' + year;
}

function getLocalDay(date) {
  let day = date.getDay();

  if (day === 0) {
    day = 7;
  }

  return day;
}

function handleChange(e) {
  let input = e.target.value;
  let testRegExr = /^(\d{2})\.(\d{2})\.(\d{4})$/;
  let test = input.match(testRegExr);

  if (test) {
    const [, inpDay, inpMonth, inpYear] = test;
    this.date = new Date(inpYear + '-' + inpMonth + '-' + inpDay);
    if (this.date.toString() === 'Invalid Date') {
      alert('Неправильное значение даты');
      return;
    }
    this.selectedDate = new Date(this.date);
    this.monthElement.textContent = MONTHS[this.date.getMonth()] + ' ' + this.date.getFullYear();
    this.populateDates();
  }
}


const calendar1 = new DatePicker('date-picker-1');
calendar1.render();

const calendar2 = new DatePicker('date-picker-2');
calendar2.render();
