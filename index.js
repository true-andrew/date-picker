const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const WEEK_DAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

class DatePicker {
  constructor(id) {
    this.element = document.getElementById(id);
    this.date = new Date();
    this.selectedDate = new Date();
    this.todayDate = new Date();
    this.notManualEditing = 0;
    this.populateMonths = this.populateMonths.bind(this);
    this.populateYears = this.populateYears.bind(this);
    this.goToMonth = this.goToMonth.bind(this);
    this.goToYear = this.goToYear.bind(this);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.handleMonthClick = this.handleMonthClick.bind(this);
    this.handleYearClick = this.handleYearClick.bind(this);
  }

  goToMonth(value) {
    let month = this.date.getMonth() + value;
    let year = this.date.getFullYear();
    if (month === -1) {
      month = 11;
      year--;
      this.date.setFullYear(year);
    } else if (month === 12) {
      month = 0;
      year++;
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

  handleDayClick(e) {
    const prev = e.target.classList.contains('prev');
    const next = e.target.classList.contains('next');

    if (e.target.classList.contains('day')) {
      const {year, month, day} = e.target.dataset;
      this.selectedDayEl.classList.remove('selected');
      this.selectedDayEl = e.target;
      e.target.classList.add('selected');
      this.selectedDate = new Date(parseInt(year), parseInt(month), parseInt(day));
      this.selectedDateElement.value = formatDate(this.selectedDate);
    }

    if (prev || next) {
      prev ? this.goToMonth(-1) : this.goToMonth(1);
    } else {
      this.populateDates(true);
    }
  }

  handleMonthClick(e) {
    const month = parseInt(e.target.dataset.month);
    this.weekDays.style = '';
    this.daysElement.classList.replace('months', 'days');
    this.selectedDate.setMonth(month);
    this.date.setMonth(month);
    this.selectedDateElement.value = formatDate(this.selectedDate);
    this.monthElement.addEventListener('click', this.populateMonths);
    this.nextMonthElement.removeEventListener('click', this.goToYear);
    this.prevMonthElement.removeEventListener('click', this.goToYear);
    this.nextMonthElement.addEventListener('click', this.handleDayClick);
    this.prevMonthElement.addEventListener('click', this.handleDayClick);
    this.notManualEditing = 0;
    this.populateDates();
  }

  handleYearClick(e) {
    const year = parseInt(e.target.dataset.year);
    this.date.setFullYear(year);
    this.selectedDate.setFullYear(year);
    this.selectedDateElement.value = formatDate(this.selectedDate);
    this.populateMonths({});
  }

  populateDates(curMonth = false) {
    this.daysElement.classList.replace('months', 'days');

    let month = this.date.getMonth();
    let year = this.date.getFullYear();
    let selectedDay = this.selectedDate.getDate();
    let selectedMonth = this.selectedDate.getMonth();
    let selectedYear = this.selectedDate.getFullYear();

    if (curMonth) {
      return;
    }

    let amount_days = new Date(year, month + 1, 0).getDate();
    let curMonthFirstDayIndex = getLocalDay(new Date(year, month, 1));
    let lastDayMonthBefore = new Date(year, month, 0).getDate();
    let curMonthEndDayIndex = getLocalDay(new Date(year, month + 1, 0));
    let firstDayNextMonth = 1;

    let newDays = document.createDocumentFragment();

    this.monthElement.textContent = MONTHS[this.date.getMonth()] + ' ' + this.date.getFullYear();

    for (let i = curMonthFirstDayIndex - 1; i >= 1; i--) {

      const dayElement = createEl('div', 'day prev', String(lastDayMonthBefore - i + 1));

      dayElement.dataset.year = year.toString();
      dayElement.dataset.month = (month - 1).toString();
      dayElement.dataset.day = (lastDayMonthBefore - i + 1).toString();

      dayElement.addEventListener('click', this.handleDayClick);

      newDays.appendChild(dayElement);
    }

    for (let i = 0; i < amount_days; i++) {
      const dayElement = document.createElement('div');
      dayElement.classList.add('day');
      dayElement.textContent = String(i + 1);
      dayElement.id = 'day' + (i + 1);
      dayElement.dataset.year = year.toString();
      dayElement.dataset.month = (month).toString();
      dayElement.dataset.day = (i + 1).toString();

      if (selectedDay === (i + 1) && selectedYear === year && selectedMonth === month) {
        dayElement.classList.add('selected');
        this.selectedDayEl = dayElement;
      }

      dayElement.addEventListener('click', this.handleDayClick);

      newDays.appendChild(dayElement);
    }

    for (let i = curMonthEndDayIndex + 1; i <= 7; i++) {
      const dayElement = document.createElement('div');
      const dayNumber = firstDayNextMonth;

      dayElement.classList.add('day', 'next');
      dayElement.textContent = String(firstDayNextMonth++);
      dayElement.dataset.year = year.toString();
      dayElement.dataset.month = (month + 1).toString();
      dayElement.dataset.day = dayNumber.toString();

      dayElement.addEventListener('click', this.handleDayClick);

      newDays.appendChild(dayElement);
    }
    this.daysElement.textContent = '';
    this.daysElement.appendChild(newDays);
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
      monthEl.dataset.month = i.toString();
      monthEl.textContent = month;

      monthEl.addEventListener('click', this.handleMonthClick);

      this.daysElement.appendChild(monthEl);
    }


  }

  populateYears() {
    const curYear = this.date.getFullYear();
    this.notManualEditing = 10;
    this.monthElement.textContent = curYear + ' - ' + (curYear + 9);
    this.daysElement.innerHTML = '';

    this.monthElement.removeEventListener('click', this.populateYears);

    for (let i = 0; i < 12; i++) {
      let year = curYear - 1 + i;


      let yearEl = document.createElement('div');

      yearEl.classList.add('day');
      yearEl.dataset.year = year.toString();
      yearEl.textContent = year.toString();

      if (this.selectedDate.getFullYear() === year) {
        yearEl.classList.add('selected');
      }

      if (i === 0) {
        yearEl.classList.add('prev');
      } else if (i === 11) {
        yearEl.classList.add('next');
      }

      yearEl.addEventListener('click', this.handleYearClick);

      this.daysElement.appendChild(yearEl);
    }
  }

  render() {
    this.calendar = createEl('div', 'dates');

    this.selectedDateElement = createEl('input', 'selected-date');
    this.selectedDateElement.type = 'text';
    this.selectedDateElement.placeholder = 'DD.MM.YYYY';
    this.selectedDateElement.maxLength = 10;

    let monthHeader = createEl('div', 'month-header');
    this.prevMonthElement = createEl('div', 'arrows prev', '<');
    this.nextMonthElement = createEl('div', 'arrows next', '>');
    this.monthElement = createEl('div', 'mth');

    monthHeader.append(this.prevMonthElement, this.monthElement, this.nextMonthElement);

    this.weekDays = createEl('div', 'weekDays');
    this.selectedDateElement.value = formatDate(this.selectedDate);

    for (let dayName of WEEK_DAY_NAMES) {
      const el = document.createElement('div');
      el.textContent = dayName;
      this.weekDays.appendChild(el);
    }

    this.daysElement = createEl('div', 'visible-area days');

    this.calendar.append(monthHeader, this.weekDays, this.daysElement);
    this.element.append(this.selectedDateElement);

    this.element.addEventListener('focusin', showCalendar.bind(this));

    this.selectedDateElement.addEventListener('beforeinput', handleChange.bind(this));
    this.selectedDateElement.addEventListener('paste', e => e.preventDefault());
    this.nextMonthElement.addEventListener('click', this.handleDayClick);
    this.prevMonthElement.addEventListener('click', this.handleDayClick);
    this.monthElement.addEventListener('click', this.populateMonths);

    this.populateDates();
  }
}

//Functions
function showCalendar() {
  this.element.appendChild(this.calendar);
  document.addEventListener('click', (ev) => {
    if (!ev.composedPath().includes(this.element)) {
      this.calendar.remove();
    } else {
      this.element.appendChild(this.calendar);
    }
  })
}

function handleChange(e) {
  if (this.notManualEditing) {
    e.target.value = formatDate(this.selectedDate);
    return;
  }

  function keyboardTyping() {
    input = input.split('');
    if (cursorPosition === 2 || cursorPosition === 5) {
      if (/[.,/-]/.test(savedChar)) {
        cursorPosition += 1;
        e.target.selectionStart = e.target.selectionEnd = cursorPosition;

      } else if (/\d/.test(savedChar)) {
        cursorPosition += 2;
        input[cursorPosition - 1] = savedChar;
      }
    } else {
      input[cursorPosition] = savedChar;
      cursorPosition += 1;
    }

    input = input.join('');

    e.target.value = input;
    e.target.selectionStart = e.target.selectionEnd = cursorPosition;
  }

  let input = e.target.value;
  let cursorPosition = e.target.selectionStart;
  let savedChar = e.data;

  if (cursorPosition === 10) return;

  if (e.target.selectionEnd === e.target.selectionStart) keyboardTyping();
  else {
    // input = input.slice(0, e.target.selectionStart) + savedChar + input.slice(e.target.selectionEnd,);
  }

  let testRegExr = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/;
  let test = input.match(testRegExr);

  if (/[^\d.,/]/g.test(input)) {
    e.target.value = formatDate(this.selectedDate);
    return;
  }

  if (test) {
    const [, inpDay, inpMonth, inpYear] = test;
    this.date = new Date(inpYear + '-' + inpMonth + '-' + inpDay);
    if (this.date.toString() === 'Invalid Date') {
      e.target.value = formatDate(this.selectedDate);
      e.target.selectionStart = e.target.selectionEnd = cursorPosition - 1;
      return;
    }
    this.selectedDate = new Date(this.date);
    this.monthElement.textContent = MONTHS[this.date.getMonth()] + ' ' + this.date.getFullYear();
    this.populateDates();
  }
}

//Helper Functions
function normalizeDate(d) {

}

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

function createEl(elName, classList, text = '') {
  const el = document.createElement(elName);
  el.classList = classList;
  if (text) el.textContent = text;

  return el;
}

const calendar1 = new DatePicker('date-picker-1');
calendar1.render();