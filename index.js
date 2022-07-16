const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const WEEK_DAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

class DatePicker {
  constructor(id) {
    this.element = document.getElementById(id);
    this.date = new Date();
    this.selectedDate = new Date();
    this.todayDate = new Date();
    this.notManualEditing = 0;
  }

  handleEvent(ev) {
    // console.log(ev.type, ' - ', ev.target)
    if (ev.type === 'focus') {
      this.calendar.style.display = 'block';
    } else if (ev.type === 'blur') {
      if ((ev.relatedTarget === this.calendar) || (ev.relatedTarget === this.todayBtn)) return;
      this.calendar.style.display = 'none';
    } else if (ev.type === 'click') {
      this.selectedDateElement.focus();
      let target = ev.target;
      switch (ev.target) {
        case this.calendar.children[0]:
          return;
        case this.monthElement:
          return;
        case this.nextMonthElement:
          this.handleDayClick(target);
          return;
        case this.prevMonthElement:
          this.handleDayClick(target);
          return;
        case this.todayBtn:
          this.setDay(this.todayDate);
          break;
        default:
          this.handleDayClick(target);
          return;
      }
    } else if (ev.type === 'keydown') {
      this.handleInput(ev);
    }
  }

  setDay(date) {
    let currentMonth = false;
    // if (this.date.getFullYear() === date.getFullYear() && this.date.getMonth() === date.getMonth()) {
    //   currentMonth = true;
    // }
    this.date = new Date(date);
    this.selectedDate = new Date(date);
    this.selectedDateElement.value = formatDate(this.date)
    this.populateDates(currentMonth);
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

  handleDayClick(el) {
    const prev = el.classList.contains('prev');
    const next = el.classList.contains('next');

    if (el.classList.contains('day')) {
      const {year, month, day} = el.dataset;
      this.selectedDayEl.classList.remove('selected');
      this.selectedDayEl = el;
      el.classList.add('selected');
      this.selectedDate = new Date(parseInt(year), parseInt(month), parseInt(day));
      this.selectedDateElement.value = formatDate(this.selectedDate);
    }

    if (prev || next) {
      prev ? this.goToMonth(-1) : this.goToMonth(1);
    } else {
      this.populateDates(true);
    }
  }

  handleMonthClick(target) {
    debugger
    const month = parseInt(target.dataset.month);
    this.weekDays.style = '';
    this.daysElement.classList.replace('months', 'days');
    this.selectedDate.setMonth(month);
    this.date.setMonth(month);
    this.selectedDateElement.value = formatDate(this.selectedDate);
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
    let todayDay = this.todayDate.getDate();
    let todayMonth = this.todayDate.getMonth();
    let todayYear = this.todayDate.getFullYear();

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

      newDays.appendChild(dayElement);
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
      }

      newDays.appendChild(dayElement);
    }

    for (let i = curMonthEndDayIndex + 1; i <= 7; i++) {
      const dayElement = createEl('div', 'day next', String(firstDayNextMonth));
      const dayNumber = ++firstDayNextMonth;
      dayElement.dataset.year = year.toString();
      dayElement.dataset.month = (month + 1).toString();
      dayElement.dataset.day = dayNumber.toString();

      newDays.appendChild(dayElement);
    }
    this.daysElement.textContent = '';
    this.daysElement.appendChild(newDays);
  }

  populateMonths(cur = false) {
    this.notManualEditing = 1;
    this.monthElement.textContent = this.selectedDate.getFullYear().toString();

    if (typeof cur === 'boolean') return;

    this.weekDays.style = 'display: none;';
    this.daysElement.textContent = '';
    this.daysElement.classList.replace('days', 'months');

    let monthsContainer = document.createDocumentFragment();

    for (let i = 0; i < 12; i++) {
      let month = MONTHS[i];
      let monthEl = createEl('div', 'day', month);

      if (this.selectedDate.getFullYear() === this.date.getFullYear() && this.selectedDate.getMonth() === i) {
        monthEl.classList.add('selected');
      }

      monthEl.dataset.month = i.toString();

      monthsContainer.appendChild(monthEl);
    }

    this.daysElement.append(monthsContainer);
  }

  populateYears() {
    const curYear = this.date.getFullYear();
    this.notManualEditing = 10;
    this.monthElement.textContent = curYear + ' - ' + (curYear + 9);
    this.daysElement.textContent = '';
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

      yearsContainer.appendChild(yearEl);
    }

    this.daysElement.append(yearsContainer)
  }

  handleInput(ev) {
    const skip = ['ArrowLeft', 'ArrowRight', 'Delete', 'Backspace'];
    if(skip.includes(ev.key)) return;
    ev.preventDefault();
    if (ev.key.charCodeAt(0) < 44 || ev.key.charCodeAt(0) > 57) return;
    let cursorPosition = ev.target.selectionStart;
    if (cursorPosition === 10) return;
    let inputFieldValue = ev.target.value;
    let inputChar = ev.key;
    if (inputFieldValue.length < 10) {
      inputFieldValue = formatDate(this.date);
    } else if (cursorPosition === 2 || cursorPosition === 5) {
      if (/\d/.test(inputChar)) cursorPosition += 1;
      else inputChar = '.';
    }

    inputFieldValue = inputFieldValue.slice(0, cursorPosition) + inputChar + inputFieldValue.slice(cursorPosition + 1,);

    let [inpDay, inpMonth, inpYear] = inputFieldValue.split('.');
    if (parseInt(inpDay) > 31) inpDay = '30';
    else if (parseInt(inpDay) === 0) inpDay = '01';
    if (parseInt(inpMonth) > 12) inpMonth = '12';
    else if (parseInt(inpMonth) === 0) inpMonth = '01';
    this.date = new Date(inpYear + '-' + inpMonth + '-' + inpDay);
    if (this.date.toString() === 'Invalid Date') {
      ev.target.value = formatDate(this.selectedDate);
      ev.target.selectionStart = ev.target.selectionEnd = cursorPosition;
      return;
    }
    this.selectedDate = new Date(this.date);
    this.monthElement.textContent = MONTHS[this.date.getMonth()] + ' ' + this.date.getFullYear();
    ev.target.value = formatDate(this.date);
    ev.target.selectionStart = ev.target.selectionEnd = cursorPosition + 1;
    this.populateDates();
  }


  render() {
    this.calendar = createEl('div', 'dates', '');
    this.calendar.tabIndex = -1;

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

    this.todayBtn = createEl('button', 'btn today', 'Сегодня');


    this.calendar.append(monthHeader, this.weekDays, this.daysElement, this.todayBtn);

    this.calendar.addEventListener('click', this);
    this.selectedDateElement.addEventListener('focus', this);
    this.selectedDateElement.addEventListener('blur', this);
    this.selectedDateElement.addEventListener('keydown', this);

    this.element.append(this.selectedDateElement, this.calendar);

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

function createEl(elName, classList, text = '') {
  const el = document.createElement(elName);
  el.classList = classList;
  if (text) el.textContent = text;

  return el;
}

const calendar1 = new DatePicker('date-picker-1');
calendar1.render();

// const calendar2 = new DatePicker('date-picker-2');
// calendar2.render()