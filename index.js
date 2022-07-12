const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const WEEK_DAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

class DatePicker {
  constructor(id) {
    this.element = document.getElementById(id);
    this.date = new Date();
    this.selectedDate = new Date();
    this.notManualEditing = 0;
    this.populateMonths = this.populateMonths.bind(this);
    this.populateYears = this.populateYears.bind(this);
    this.goToNextMonth = this.goToNextMonth.bind(this);
    this.goToPrevMonth = this.goToPrevMonth.bind(this);
    this.goToYear = this.goToYear.bind(this);
    this.handleElementClick = this.handleElementClick.bind(this);
  }

  goToNextMonth() {
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

  goToPrevMonth() {
    let month = this.date.getMonth() - 1;
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

  goToYear(e) {
    let year = this.date.getFullYear();
    if (e.target.classList.contains('next')) {
      year += this.notManualEditing;
    } else {
      year -= this.notManualEditing;
    }
    this.date.setFullYear(year);
    this.selectedDate.setFullYear(year);
    this.selectedDateElement.value = formatDate(this.selectedDate);

    if (this.notManualEditing === 1) {
      this.populateMonths();
      return;
    }
    this.populateYears();
  }

  handleElementClick(e) {
    const newDate = e.target.dataset;
    const prev = e.target.classList.contains('prev');
    const next = e.target.classList.contains('next');
    this.selectedDate = new Date(newDate.year + '-' + newDate.month + '-' + newDate.day);
    this.selectedDateElement.value = formatDate(this.selectedDate);
    if (prev || next) {
      prev ? this.goToPrevMonth() : this.goToNextMonth();
    } else {
      this.populateDates(true);
    }
  }

  populateDates(curMonth = false) {
    this.daysElement.classList.replace('months', 'days');

    let month = this.date.getMonth();
    let year = this.date.getFullYear();
    let selectedDay = this.selectedDate.getDate();
    let selectedMonth = this.selectedDate.getMonth();
    let selectedYear = this.selectedDate.getFullYear();

    if (curMonth) {
      const lastSelected = this.daysElement.querySelector('.selected');
      if (lastSelected) lastSelected.classList.remove('selected');
      this.daysElement.querySelector(`#day${selectedDay}`).classList.add('selected');
      return;
    }

    let amount_days = new Date(year, month + 1, 0).getDate();
    let curMonthFirstDayIndex = getLocalDay(new Date(year, month, 1));
    let lastDayMonthBefore = new Date(year, month, 0).getDate();
    let curMonthEndDayIndex = getLocalDay(new Date(year, month + 1, 0));
    let firstDayNextMonth = 1;

    this.daysElement.innerHTML = '';
    this.monthElement.textContent = MONTHS[this.date.getMonth()] + ' ' + this.date.getFullYear();

    for (let i = curMonthFirstDayIndex - 1; i >= 1; i--) {
      const dayElement = document.createElement('div');
      dayElement.classList.add('day', 'prev');
      dayElement.textContent = String(lastDayMonthBefore - i + 1);
      dayElement.dataset.year = year.toString();
      dayElement.dataset.month = month.toString();
      dayElement.dataset.day = (lastDayMonthBefore - i + 1).toString();
      this.daysElement.appendChild(dayElement);

      dayElement.addEventListener('click', this.handleElementClick);
    }

    for (let i = 0; i < amount_days; i++) {
      const dayElement = document.createElement('div');
      dayElement.classList.add('day');
      dayElement.textContent = String(i + 1);
      dayElement.id = 'day' + (i + 1);
      dayElement.dataset.year = year.toString();
      dayElement.dataset.month = (month+1).toString();
      dayElement.dataset.day = (i+1).toString();

      if (selectedDay === (i + 1) && selectedYear === year && selectedMonth === month) {
        dayElement.classList.add('selected');
      }

      dayElement.addEventListener('click', this.handleElementClick);

      this.daysElement.appendChild(dayElement);
    }

    for (let i = curMonthEndDayIndex + 1; i <= 7; i++) {
      const dayElement = document.createElement('div');
      const dayNumber = firstDayNextMonth;

      dayElement.classList.add('day', 'next');
      dayElement.textContent = String(firstDayNextMonth++);
      dayElement.dataset.year = year.toString();
      dayElement.dataset.month = (month+2).toString();
      dayElement.dataset.day = dayNumber.toString();
      this.daysElement.appendChild(dayElement);

      dayElement.addEventListener('click', this.handleElementClick);
    }
  }

  populateMonths(cur = false) {
    this.notManualEditing = 1;
    this.monthElement.textContent = this.selectedDate.getFullYear().toString();

    if (typeof cur === 'boolean') return;

    this.monthElement.removeEventListener('click', this.populateMonths);
    this.monthElement.addEventListener('click', this.populateYears);
    this.prevMonthElement.removeEventListener('click', this.goToPrevMonth);
    this.prevMonthElement.addEventListener('click', this.goToYear);
    this.nextMonthElement.removeEventListener('click', this.goToNextMonth);
    this.nextMonthElement.addEventListener('click', this.goToYear);

    this.weekDays.style = 'display: none;';
    this.daysElement.innerHTML = '';
    this.daysElement.classList.replace('days', 'months');

    for (let i = 0; i < MONTHS.length; i++) {
      let month = MONTHS[i];
      let monthEl = document.createElement('div');

      if (this.selectedDate.getFullYear() === this.date.getFullYear() && this.selectedDate.getMonth() === i) {
        monthEl.classList.add('selected');
      }

      monthEl.classList.add('day');
      monthEl.textContent = month;

      monthEl.addEventListener('click', () => {
        this.weekDays.style = '';
        this.daysElement.classList.replace('months', 'days');
        this.selectedDate.setMonth(i);
        this.date.setMonth(i);
        this.selectedDateElement.value = formatDate(this.selectedDate);
        this.monthElement.addEventListener('click', this.populateMonths);
        this.nextMonthElement.removeEventListener('click', this.goToYear);
        this.prevMonthElement.removeEventListener('click', this.goToYear);
        this.nextMonthElement.addEventListener('click', this.goToNextMonth);
        this.prevMonthElement.addEventListener('click', this.goToPrevMonth);
        this.notManualEditing = 0;
        this.populateDates();
      })

      this.daysElement.appendChild(monthEl);
    }


  }

  populateYears() {
    this.notManualEditing = 10;
    this.monthElement.textContent = this.date.getFullYear() + ' - ' + (this.date.getFullYear() + 9);
    this.daysElement.innerHTML = '';

    this.monthElement.removeEventListener('click', this.populateYears);

    for (let i = 0; i < 12; i++) {
      let year = this.date.getFullYear() - 1 + i;
      let yearEl = document.createElement('div');

      yearEl.classList.add('day');
      yearEl.textContent = year.toString();

      if (this.selectedDate.getFullYear() === year) {
        yearEl.classList.add('selected');
      }

      if (i === 0) {
        yearEl.classList.add('prev');
      } else if (i === 11) {
        yearEl.classList.add('next');
      }

      yearEl.addEventListener('click', () => {
        this.date.setFullYear(year);
        this.selectedDate.setFullYear(year);
        this.selectedDateElement.value = formatDate(this.selectedDate);
        this.populateMonths({});
      });

      this.daysElement.appendChild(yearEl);
    }
  }

  render() {
    this.element.innerHTML = `
    <label><input class="selected-date" placeholder="DD.MM.YYYY" minlength="10" maxlength="10" type="text" pattern="(\\d{2}\\.){2}\\d{4}"></label>
    
    <div class="dates">
        <div class="month-header">
            <div class="arrows prev">&lt;</div>
            <div class="mth"></div>
            <div class="arrows next">&gt;</div>
        </div>
        <div class="weekDays"></div>
        <div class="visible-area days"></div>
    </div>
    `;

    this.selectedDateElement = this.element.querySelector(`.selected-date`);
    this.monthElement = this.element.querySelector(`.mth`);
    this.nextMonthElement = this.element.querySelector(`.next`);
    this.prevMonthElement = this.element.querySelector(`.prev`);
    this.daysElement = this.element.querySelector(`.days`);
    this.weekDays = this.element.querySelector(`.weekDays`);

    this.selectedDateElement.value = formatDate(this.selectedDate);

    for (let dayName of WEEK_DAY_NAMES) {
      this.weekDays.innerHTML += `<div>${dayName}</div>`
    }

    this.selectedDateElement.addEventListener('input', handleChange.bind(this));
    this.nextMonthElement.addEventListener('click', this.goToNextMonth);
    this.prevMonthElement.addEventListener('click', this.goToPrevMonth);
    this.monthElement.addEventListener('click', this.populateMonths);

    this.populateDates();
  }
}

//Functions
function handleChange(e) {
  if (this.notManualEditing) {
    e.target.value = formatDate(this.selectedDate);
    return;
  }
  let input = e.target.value;
  let testRegExr = /^(\d{2})\.(\d{2})\.(\d{4})$/;
  let test = input.match(testRegExr);

  if (/[^\d.]/g.test(input)) {
    e.target.value = formatDate(this.selectedDate);
    return;
  }

  if (test) {
    const [, inpDay, inpMonth, inpYear] = test;
    this.date = new Date(inpYear + '-' + inpMonth + '-' + inpDay);
    if (this.date.toString() === 'Invalid Date') {
      e.target.value = formatDate(this.selectedDate);
      return;
    }
    this.selectedDate = new Date(this.date);
    this.monthElement.textContent = MONTHS[this.date.getMonth()] + ' ' + this.date.getFullYear();
    this.populateDates();
  }
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

const calendar1 = new DatePicker('date-picker-1');
calendar1.render();