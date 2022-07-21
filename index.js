const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const WEEK_DAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];


class DatePicker {
  //elements
  container = undefined;
  calendar = undefined;
  inputElement = undefined;
  prevMonthElement = undefined;
  nextMonthElement = undefined;
  monthElement = undefined;
  weekDays = undefined;
  daysElement = undefined;
  todayBtn = undefined;
  //data
  date = undefined;
  selectedDate = {
    year: undefined,
    month: undefined,
    day: undefined,
    equal: false
  }
  chooseMode = 'days';
  //regexp
  regExDelete = /delete/;
  regExIsNumber = /\d/;
  regExIsNotNumber = /\D/;

  constructor(id) {
    this.container = document.getElementById(id);
    this.date = new Date();
  }

  handleEvent(ev) {
    if (ev.type === 'focus') {
      this.handleFocusEvent(ev);
    } else if (ev.type === 'blur') {
      this.handleBlurEvent(ev);
    } else if (ev.type === 'click') {
      this.handleClickEvent(ev);
    } else if (ev.type === 'input') {
      this.handleInputEvent(ev);
    }
  }

  handleBlurEvent(ev) {
    if ((ev.relatedTarget === this.calendar) || (ev.relatedTarget === this.todayBtn)) {
      return;
    }
    if (this.chooseMode !== 'days') {
      this.renderDates();
    }
    this.calendar.style.display = 'none';
  }

  handleFocusEvent(ev) {
    this.calendar.style.display = 'block';
  }

  handleClickEvent(ev) {
    const target = ev.target;
    this.inputElement.focus();
    switch (target) {
      case this.calendar.children[0]:
        return;
      case this.monthElement:
        if (this.chooseMode === 'days') {
          this.renderMonths();
        } else if (this.chooseMode === 'months') {
          this.renderYears();
        }
        return;
      case this.nextMonthElement:
      case this.prevMonthElement:
        if (this.chooseMode === 'days') {
          this.goToMonth(target.dataset.month, target.dataset.year);
        } else {
          this.goToYear(target.dataset.year);
        }
        return;
      case this.todayBtn:
        this.setToday(target);
        return;
      default:
        if (target.classList.contains('day')) {
          if (this.chooseMode === 'days') {
            this.chooseDay(target);
          } else if (this.chooseMode === 'months') {
            this.chooseMonth(target);
          } else {
            this.chooseYear(target);
          }
        }
        return;
    }
  }

  setToday(el) {
    this.chooseDay(el);
  }

  goToMonth(month, year) {
    this.selectedDate.equal = this.date.getMonth() !== Number(month);
    this.date.setFullYear(year);
    this.date.setMonth(month);
    this.renderDates();
  }

  goToYear(year) {
    this.date.setFullYear(year);
    if (this.chooseMode === 'months') {
      this.renderMonths();
    } else {
      this.renderYears();
    }
  }

  chooseDay(el) {
    const {year, month, day} = el.dataset;
    const prev = el.classList.contains('prev');
    const next = el.classList.contains('next');
    const today = el.classList.contains('today');
    const input = el.classList.contains('selected-date');

    this.date.setDate(day);

    if (prev || next || today || input) {
      this.goToMonth(month, year);
    }

    this.selectedDate.year = parseInt(year);
    this.selectedDate.month = parseInt(month);
    this.selectedDate.day = parseInt(day);

    this.inputElement.value = formatDate(this.date);
    this.setSelected(year, month, day);
  }

  chooseMonth(target) {
    const month = parseInt(target.dataset.month);
    this.weekDays.style = '';
    this.daysElement.classList.replace('months', 'days');
    this.date.setMonth(month);
    this.renderDates();
  }

  chooseYear(target) {
    const year = parseInt(target.dataset.year);
    this.date.setFullYear(year);
    this.renderMonths();
  }

  writeDataset(el, year, month, day) {
    el.dataset.year = year;
    el.dataset.month = month;
    el.dataset.day = day;
  }

  setSelected(year, month, day) {
    if (!year || !month || !day) {
      return;
    }
    for (const dayEl of this.daysElement.children) {
      if (dayEl.dataset.year === year.toString()
        && dayEl.dataset.month === month.toString()
        && dayEl.dataset.day === day.toString()) {
        dayEl.classList.add('selected');
      } else if (dayEl.classList.contains('selected')) {
        dayEl.classList.remove('selected');
      }
    }
  }

  renderDates() {
    this.daysElement.classList.replace('months', 'days');

    this.chooseMode = 'days';
    const currentDay = this.date.getDate();
    const currentMonth = this.date.getMonth();
    const currentYear = this.date.getFullYear();

    if (currentMonth === this.selectedDate.month && currentYear === this.selectedDate.year && !this.selectedDate.equal) {
      this.setSelected(currentYear, currentMonth, currentDay);
      return;
    }

    const todayDate = new Date();
    const todayDay = todayDate.getDate();
    const todayMonth = todayDate.getMonth();
    const todayYear = todayDate.getFullYear();

    const prevMonth = new Date(currentYear, currentMonth, 0);
    const nextMonth = new Date(currentYear, currentMonth + 1, 1);

    this.writeDataset(this.prevMonthElement, prevMonth.getFullYear(), prevMonth.getMonth());
    this.writeDataset(this.nextMonthElement, nextMonth.getFullYear(), nextMonth.getMonth());

    const lastDayCurMonth = new Date(currentYear, currentMonth + 1, 0);
    const amountDays = lastDayCurMonth.getDate();
    const curMonthEndDayIndex = getLocalDay(lastDayCurMonth);
    const curMonthFirstDayIndex = getLocalDay(new Date(currentYear, currentMonth, 1));
    const lastDayMonthBefore = prevMonth.getDate();
    let firstDayNextMonth = 1;

    const daysContainer = document.createDocumentFragment();

    this.monthElement.textContent = MONTHS[currentMonth] + ' ' + currentYear;

    for (let i = curMonthFirstDayIndex - 1; i >= 1; i--) {
      const dayNum = lastDayMonthBefore - i + 1;
      const dayElement = createEl('div', 'day prev', String(dayNum));
      this.writeDataset(dayElement, prevMonth.getFullYear(), prevMonth.getMonth(), dayNum);
      daysContainer.append(dayElement);
    }

    for (let i = 0; i < amountDays; i++) {
      const dayNum = i + 1;
      const dayElement = createEl('div', 'day', String(dayNum));
      this.writeDataset(dayElement, currentYear, currentMonth, dayNum);

      if (todayDay === (i + 1) && todayMonth === currentMonth && todayYear === currentYear) {
        dayElement.classList.add('today');
      }

      daysContainer.append(dayElement);
    }

    for (let i = curMonthEndDayIndex + 1; i <= 7; i++) {
      const dayElement = createEl('div', 'day next', String(firstDayNextMonth));
      const dayNum = firstDayNextMonth++;
      this.writeDataset(dayElement, nextMonth.getFullYear(), nextMonth.getMonth(), dayNum);
      daysContainer.append(dayElement);
    }

    this.daysElement.replaceChildren(daysContainer);


    this.setSelected(this.selectedDate.year, this.selectedDate.month, this.selectedDate.day);
  }

  renderMonths() {
    this.monthElement.textContent = this.date.getFullYear().toString();

    this.chooseMode = 'months';
    this.weekDays.style = 'display: none;';
    this.daysElement.classList.replace('days', 'months');

    this.writeDataset(this.prevMonthElement, this.date.getFullYear() - 1);
    this.writeDataset(this.nextMonthElement, this.date.getFullYear() + 1);

    const monthsContainer = document.createDocumentFragment();

    for (let i = 0; i < 12; i++) {
      const month = MONTHS[i];
      const monthEl = createEl('div', 'day', month);

      if (this.date.getFullYear() === this.selectedDate.year && this.date.getMonth() === i) {
        monthEl.classList.add('selected');
      }

      monthEl.dataset.month = i.toString();

      monthsContainer.append(monthEl);
    }

    this.daysElement.replaceChildren(monthsContainer);
  }

  renderYears() {
    this.chooseMode = 'years';
    const curYear = this.date.getFullYear();
    this.monthElement.textContent = curYear + ' - ' + (curYear + 9);
    this.daysElement.classList.replace('days', 'months');

    this.writeDataset(this.prevMonthElement, this.date.getFullYear() - 10);
    this.writeDataset(this.nextMonthElement, this.date.getFullYear() + 10);

    const yearsContainer = document.createDocumentFragment();

    for (let i = 0; i < 12; i++) {
      const year = curYear - 1 + i;

      const yearEl = createEl('div', 'day', String(year));

      yearEl.dataset.year = year.toString();

      if (this.selectedDate.year === year) {
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

  handleInputEvent(ev) {
    if (this.regExDelete.test(ev.inputType)) {
      return;
    }

    let cursorPosition = ev.target.selectionStart - 1;
    let inputFieldValue = ev.target.value;
    let inputChar = ev.data;

    if (inputFieldValue.length <= 10) {
      inputFieldValue = formatDate(this.date).split('');
    } else {
      inputFieldValue = inputFieldValue.split('');
      inputFieldValue.splice(cursorPosition, 1);
    }

    if (cursorPosition === 10) {
      ev.target.value = inputFieldValue.slice(0, 10).join('');
      return;
    }

    if (cursorPosition === 2 || cursorPosition === 5) {
      if (this.regExIsNumber.test(inputChar)) {
        cursorPosition += 1;
      } else {
        inputChar = '.';
      }
    } else if (this.regExIsNotNumber.test(inputChar)) {
      ev.target.value = formatDate(this.date);
      ev.target.selectionStart = ev.target.selectionEnd = cursorPosition;
      return;
    }

    inputFieldValue[cursorPosition] = inputChar;

    let inpDay = inputFieldValue[0] + inputFieldValue[1];
    let inpMonth = inputFieldValue[3] + inputFieldValue[4];
    let inpYear = inputFieldValue[6] + inputFieldValue[7] + inputFieldValue[8] + inputFieldValue[9];

    if (parseInt(inpDay) > 31) {
      inpDay = '30';
    } else if (parseInt(inpDay) === 0) {
      inpDay = '01';
    }
    if (parseInt(inpMonth) > 12) {
      inpMonth = '12';
    } else if (parseInt(inpMonth) === 0) {
      inpMonth = '01';
    }
    if (parseInt(inpYear) < 1000) {
      inpYear = '1000';
    }

    this.date = new Date(inpYear + '-' + inpMonth + '-' + inpDay);

    ev.target.value = formatDate(this.date);
    ev.target.selectionStart = ev.target.selectionEnd = cursorPosition + 1;
    this.writeDataset(ev.target, this.date.getFullYear(), this.date.getMonth(), this.date.getDate());
    this.chooseDay(ev.target);
  }


  render() {
    this.inputElement = createEl('input', 'selected-date', '', {
      type: 'text',
      placeholder: 'DD.MM.YYYY',
      maxLength: 11,
    });

    this.calendar = createEl('div', 'calendar', '', {tabIndex: -1});

    const monthHeader = createEl('div', 'month-header');
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
    this.writeDataset(this.todayBtn, this.date.getFullYear(), this.date.getMonth(), this.date.getDate());

    this.calendar.append(monthHeader, this.weekDays, this.daysElement, this.todayBtn);

    this.calendar.addEventListener('click', this);
    this.inputElement.addEventListener('focus', this);
    this.inputElement.addEventListener('blur', this);
    this.inputElement.addEventListener('input', this);

    this.container.append(this.inputElement, this.calendar);

    this.renderDates();
  }
}


//Helper Functions
function formatDate(d) {
  return d.toLocaleString('ru-RU').slice(0, 10);
}

function getLocalDay(date) {
  let day = date.getDay();

  if (day === 0) {
    day = 7;
  }

  return day;
}

function createEl(elName, classList, text, options) {
  const el = document.createElement(elName);
  el.classList = classList;
  if (text) {
    el.textContent = text;
  }
  if (options) {
    for (let key in options) {
      el[key] = options[key];
    }
  }
  return el;
}

const calendar1 = new DatePicker('date-picker-1');
calendar1.render();

// const calendar2 = new DatePicker('date-picker-2');
// calendar2.render()