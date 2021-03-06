/*
const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const WEEK_DAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

function DatePicker(id) {
  this.container = document.getElementById(id);
  this.date = new Date();
  this.selectedDate = new Date();
  this.yearStep = 0;
  this.chooseMode = 'days';
}

DatePicker.prototype.chooseMode = undefined;

DatePicker.prototype.handleEvent = function (ev) {
  // console.log(ev.type, ' - ', ev.target)
  if (ev.type === 'focus') {
    this.dates.style.display = 'block';
  } else if (ev.type === 'blur') {
    if ((ev.relatedTarget === this.dates) || (ev.relatedTarget === this.todayBtn)) return;
    if (this.chooseMode !== 'days') this.populateDates();
    this.dates.style.display = 'none';
  } else if (ev.type === 'click') {
    this.inputElement.focus();
    let target = ev.target;
    switch (target) {
      case this.dates.children[0]:
        return;
      case this.monthElement:
        if (this.chooseMode === 'days') this.populateMonths();
        else if (this.chooseMode === 'months') this.populateYears();
        return;
      case this.nextMonthElement:
      case this.prevMonthElement:
        if (this.chooseMode === 'days') this.handleDayClick(target)
        else this.goToYear(target);
        return;
      case this.todayBtn:
        this.setToday();
        return;
      default:
        if (target === this.daysElement) return;
        if (this.chooseMode === 'days') this.handleDayClick(target)
        else if (this.chooseMode === 'months') this.handleMonthClick(target);
        else this.handleYearClick(target);
        return;
    }
  } else if (ev.type === 'input') {
    this.handleInput(ev);
  }
}

DatePicker.prototype.setToday = function () {
  let currentMonth = false;
  this.selectedDate = new Date();
  if (this.selectedDate.getFullYear() === this.date.getFullYear() && this.selectedDate.getMonth() === this.date.getMonth()) {
    currentMonth = true;
    this.selectedDayEl.classList.remove('selected');
    this.selectedDayEl = this.todayDayEl;
    this.selectedDayEl.classList.add('selected');
  }
  this.date = new Date();
  this.inputElement.value = formatDate(this.date);
  this.populateDates(currentMonth);
}

DatePicker.prototype.goToMonth = function (value) {
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
  this.inputElement.value = formatDate(this.selectedDate);
  this.populateDates();
}

DatePicker.prototype.goToYear = function (el) {
  let year = this.date.getFullYear();
  if (el.classList.contains('next')) {
    year += this.yearStep;
  } else {
    year -= this.yearStep;
  }
  this.date.setFullYear(year);
  this.selectedDate.setFullYear(year);
  this.inputElement.value = formatDate(this.selectedDate);

  if (this.yearStep === 1) {
    this.populateMonths(true);
    return;
  }
  this.populateYears();
}

DatePicker.prototype.handleDayClick = function (el) {
  const prev = el.classList.contains('prev');
  const next = el.classList.contains('next');

  if (el.classList.contains('day')) {
    const {year, month, day} = el.dataset;
    this.selectedDayEl.classList.remove('selected');
    this.selectedDayEl = el;
    el.classList.add('selected');
    this.selectedDate = new Date(parseInt(year), parseInt(month), parseInt(day));
    this.inputElement.value = formatDate(this.selectedDate);
  }

  if (prev || next) {
    prev ? this.goToMonth(-1) : this.goToMonth(1);
  } else {
    this.populateDates(true);
  }
}

DatePicker.prototype.handleMonthClick = function (target) {
  const month = parseInt(target.dataset.month);
  this.weekDays.style = '';
  this.daysElement.classList.replace('months', 'days');
  this.selectedDate.setMonth(month);
  this.date.setMonth(month);
  this.inputElement.value = formatDate(this.selectedDate);
  this.yearStep = 0;
  this.populateDates();
}

DatePicker.prototype.handleYearClick = function (el) {
  const year = parseInt(el.dataset.year);
  this.date.setFullYear(year);
  this.selectedDate.setFullYear(year);
  this.inputElement.value = formatDate(this.selectedDate);
  this.populateMonths();
}

DatePicker.prototype.populateDates = function (curMonth = false) {
  this.daysElement.classList.replace('months', 'days');

  if (curMonth && this.chooseMode === 'days') {
    return;
  }

  this.chooseMode = 'days';
  let month = this.date.getMonth();
  let year = this.date.getFullYear();
  let selectedDay = this.selectedDate.getDate();
  let selectedMonth = this.selectedDate.getMonth();
  let selectedYear = this.selectedDate.getFullYear();

  const today = new Date();
  let todayDay = today.getDate();
  let todayMonth = today.getMonth();
  let todayYear = today.getFullYear();

  let amount_days = new Date(year, month + 1, 0).getDate();
  let curMonthFirstDayIndex = getLocalDay(new Date(year, month, 1));
  let lastDayMonthBefore = new Date(year, month, 0).getDate();
  let curMonthEndDayIndex = getLocalDay(new Date(year, month + 1, 0));
  let firstDayNextMonth = 1;

  let daysContainer = document.createDocumentFragment();

  this.monthElement.textContent = MONTHS[month] + ' ' + year;

  for (let i = curMonthFirstDayIndex - 1; i >= 1; i--) {

    const dayElement = createEl('div', 'day prev', String(lastDayMonthBefore - i + 1));
    dayElement.dataset.year = year.toString();
    dayElement.dataset.month = (month - 1).toString();
    dayElement.dataset.day = (lastDayMonthBefore - i + 1).toString();

    daysContainer.append(dayElement);
  }

  for (let i = 0; i < amount_days; i++) {
    const dayElement = createEl('div', 'day', String(i + 1));
    dayElement.dataset.year = year.toString();
    dayElement.dataset.month = (month).toString();
    dayElement.dataset.day = (i + 1).toString();

    if (selectedDay === (i + 1) && selectedYear === year && selectedMonth === month) {
      dayElement.classList.add('selected');
      this.selectedDayEl = dayElement;
    }

    if (todayDay === (i + 1) && todayMonth === month && todayYear === year) {
      dayElement.classList.add('today');
      this.todayDayEl = dayElement;
    }

    daysContainer.append(dayElement);
  }

  for (let i = curMonthEndDayIndex + 1; i <= 7; i++) {
    const dayElement = createEl('div', 'day next', String(firstDayNextMonth));
    const dayNumber = firstDayNextMonth++;
    dayElement.dataset.year = year.toString();
    dayElement.dataset.month = (month + 1).toString();
    dayElement.dataset.day = dayNumber.toString();

    daysContainer.append(dayElement);
  }

  this.daysElement.replaceChildren(daysContainer);
}

DatePicker.prototype.populateMonths = function (cur = false) {
  this.monthElement.textContent = this.selectedDate.getFullYear().toString();

  if (cur) return;

  this.chooseMode = 'months';
  this.yearStep = 1;
  this.weekDays.style = 'display: none;';
  this.daysElement.classList.replace('days', 'months');

  let monthsContainer = document.createDocumentFragment();

  for (let i = 0; i < 12; i++) {
    let month = MONTHS[i];
    let monthEl = createEl('div', 'day', month);

    if (this.selectedDate.getFullYear() === this.date.getFullYear() && this.selectedDate.getMonth() === i) {
      monthEl.classList.add('selected');
    }

    monthEl.dataset.month = i.toString();

    monthsContainer.append(monthEl);
  }

  this.daysElement.replaceChildren(monthsContainer);
}

DatePicker.prototype.populateYears = function () {
  this.chooseMode = 'years';
  const curYear = this.date.getFullYear();
  this.yearStep = 10;
  this.monthElement.textContent = curYear + ' - ' + (curYear + 9);
  this.daysElement.classList.replace('days', 'months');

  let yearsContainer = document.createDocumentFragment();

  for (let i = 0; i < 12; i++) {
    let year = curYear - 1 + i;

    let yearEl = createEl('div', 'day', String(year));

    yearEl.dataset.year = year.toString();

    if (this.selectedDate.getFullYear() === year) {
      yearEl.classList.add('selected');
    }

    if (i === 0) {
      yearEl.classList.add('prev');
    } else if (i === 11) {
      yearEl.classList.add('next');
    }

    yearsContainer.append(yearEl);
  }

  this.daysElement.replaceChildren(yearsContainer);
}

DatePicker.prototype.handleInput = function (ev) {
  if (/delete/g.test(ev.inputType)) return;

  let cursorPosition = ev.target.selectionStart - 1;
  let inputFieldValue = ev.target.value;
  let inputChar = ev.data;

  if (inputFieldValue.length <= 10) {
    inputFieldValue = formatDate(this.selectedDate).split('');
  } else {
    inputFieldValue = inputFieldValue.split('');
    inputFieldValue.splice(cursorPosition, 1);
  }

  if (cursorPosition === 10) {
    ev.target.value = inputFieldValue.slice(0, 10).join('');
    return;
  }

  if (cursorPosition === 2 || cursorPosition === 5) {
    if (/\d/.test(inputChar)) cursorPosition += 1;
    else inputChar = '.';
  } else if (/\D/.test(inputChar)) {
    ev.target.value = formatDate(this.selectedDate);
    ev.target.selectionStart = ev.target.selectionEnd = cursorPosition;
    return;
  }

  inputFieldValue[cursorPosition] = inputChar;

  let inpDay = inputFieldValue[0] + inputFieldValue[1];
  let inpMonth = inputFieldValue[3] + inputFieldValue[4];
  let inpYear = inputFieldValue[6] + inputFieldValue[7] + inputFieldValue[8] + inputFieldValue[9];

  if (parseInt(inpDay) > 31) inpDay = '30';
  else if (parseInt(inpDay) === 0) inpDay = '01';
  if (parseInt(inpMonth) > 12) inpMonth = '12';
  else if (parseInt(inpMonth) === 0) inpMonth = '01';
  if (parseInt(inpYear) < 1000) inpYear = '1000';

  this.date = new Date(inpYear + '-' + inpMonth + '-' + inpDay);
  if (this.date.toString() === 'Invalid Date') {
    ev.target.value = formatDate(this.selectedDate);
    ev.target.selectionStart = ev.target.selectionEnd = cursorPosition;
    return;
  }
  this.selectedDate = new Date(this.date);
  ev.target.value = formatDate(this.date);
  ev.target.selectionStart = ev.target.selectionEnd = cursorPosition + 1;
  this.populateDates();
}


DatePicker.prototype.render = function () {
  this.dates = createEl('div', 'dates', '', {tabIndex: -1});

  this.inputElement = createEl('input', 'selected-date', '', {
    type: 'text',
    placeholder: 'DD.MM.YYYY',
    maxLength: 11,
    value: formatDate(this.selectedDate)
  });

  let monthHeader = createEl('div', 'month-header');
  this.prevMonthElement = createEl('div', 'arrows prev', '<');
  this.nextMonthElement = createEl('div', 'arrows next', '>');
  this.monthElement = createEl('div', 'mth');

  monthHeader.append(this.prevMonthElement, this.monthElement, this.nextMonthElement);

  this.weekDays = createEl('div', 'weekDays');

  for (let dayName of WEEK_DAY_NAMES) {
    const el = createEl('div', '', dayName);
    this.weekDays.append(el);
  }

  this.daysElement = createEl('div', 'visible-area days');

  this.todayBtn = createEl('button', 'btn today', 'Сегодня');

  this.dates.append(monthHeader, this.weekDays, this.daysElement, this.todayBtn);

  this.dates.addEventListener('click', this);
  this.inputElement.addEventListener('focus', this);
  this.inputElement.addEventListener('blur', this);
  this.inputElement.addEventListener('input', this);

  this.container.append(this.inputElement, this.dates);

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

function createEl(elName, classList, text = '', options = null) {
  const el = document.createElement(elName);
  el.classList = classList;
  if (text) el.textContent = text;
  if (options) {
    for (let key in options) {
      el[key] = options[key];
    }
  }
  return el;
}

const calendar1 = new DatePicker('date-picker-1');
calendar1.render();
*/
