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
  displayedDate = undefined;
  selectedDate = undefined;
  //regexp
  regExDelete = /delete/;
  regExIsNumber = /\d/;
  regExIsNotNumber = /\D/;

  constructor(id) {
    this.container = document.getElementById(id);
    this.displayedDate = new Date();
    this.selectedDate = new Date();
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
    } else {
      console.warn('Unhandled event: ', ev);
    }
  }

  handleBlurEvent(ev) {
    if ((ev.relatedTarget === this.calendar) || (ev.relatedTarget === this.todayBtn)) {
      return;
    }

    if (this.calendar.dataset.status !== 'days') {
      this.renderDays();
    }

    this.hide();
  }

  handleFocusEvent(ev) {
    this.show();
  }

  handleClickEvent(ev) {
    const target = ev.target;
    const action = target.dataset.action;
    this.inputElement.focus();

    if (this[action] !== undefined) {
      this[action](target);
    }
  }

  show() {
    this.calendar.style.display = 'block';
  }

  hide() {
    this.calendar.style.display = 'none';
  }

  setDate(date) {
    if (isNaN(Date.parse(date))) {
      throw new Error(date);
    }
    this.selectedDate = date;
    this.renderCalendar();
  }

  /**
   * Распарсить дату - parseDateFromElement()
   * Эту дату перенести в календарь
   * И эту дату в инпут
   *
   */


  parseDateFromElement(el) {
    const {year, month, day} = el.dataset;
    this.setDate(new Date(year, month, day));
  }

  writeDataset(el, dataset) {
    for (let key in dataset) {
      el.dataset[key] = dataset[key];
    }
  }

  setSelected(daysContainer, date) {
    const arr = daysContainer.children
    for (let i = 0, len = arr.length; i < len; i++) {
      const el = arr[i];
      if (el.dataset.year === date.getFullYear().toString()
        && el.dataset.month === date.getMonth().toString()
        && el.dataset.day === date.getDate().toString()) {
        el.classList.add('selected');
      } else if (arr[i].classList.contains('selected')) {
        el.classList.remove('selected');
      }
    }
  }

  renderCalendar() {
    const displayMode = this.calendar.dataset.status;

    if (displayMode !== undefined) {
      this[`render${displayMode}`]();
    }
  }

  /*

  setDate -> renderCalendar -> switch mode -> renderDays | renderMonth | renderYear
          -> setValueInput

  renderDays -> if(curMoth) | if(curDay || curYear || curMoth) | if(curYear)

   */

  renderDays() {
    this.daysElement.classList.replace('months', 'days');

    const currentMonth = this.displayedDate.getMonth();
    const currentYear = this.displayedDate.getFullYear();


    setInputFieldValue(this.inputElement, this.selectedDate);

    this.monthElement.dataset.action = 'renderMonths';
    this.calendar.dataset.status = 'Days';
    this.weekDays.style = '';

    const todayDate = new Date();
    const todayDay = todayDate.getDate();
    const todayMonth = todayDate.getMonth();
    const todayYear = todayDate.getFullYear();

    const prevMonth = new Date(currentYear, currentMonth, 0);
    const nextMonth = new Date(currentYear, currentMonth + 1, 1);

    this.writeDataset(this.prevMonthElement, {
      year: prevMonth.getFullYear(),
      month: prevMonth.getMonth(),
      day: '',
      action: 'parseDateFromElement'
    });
    this.writeDataset(this.nextMonthElement, {
      year: nextMonth.getFullYear(),
      month: nextMonth.getMonth(),
      day: '',
      action: 'parseDateFromElement'
    });

    const lastDayCurMonth = getLastDayOfMonth(this.displayedDate);
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
      this.writeDataset(dayElement, {
        year: prevMonth.getFullYear(),
        month: prevMonth.getMonth(),
        day: dayNum,
        action: 'parseDateFromElement'
      });
      daysContainer.append(dayElement);
    }

    for (let i = 0; i < amountDays; i++) {
      const dayNum = i + 1;
      const dayElement = createEl('div', 'day', String(dayNum));
      this.writeDataset(dayElement, {
        year: currentYear,
        month: currentMonth,
        day: dayNum,
        action: 'parseDateFromElement'
      });

      if (todayDay === (i + 1) && todayMonth === currentMonth && todayYear === currentYear) {
        dayElement.classList.add('today');
      }

      daysContainer.append(dayElement);
    }

    for (let i = curMonthEndDayIndex + 1; i <= 7; i++) {
      const dayElement = createEl('div', 'day next', String(firstDayNextMonth));
      const dayNum = firstDayNextMonth++;
      this.writeDataset(dayElement, {
        year: nextMonth.getFullYear(),
        month: nextMonth.getMonth(),
        day: dayNum,
        action: 'parseDateFromElement'
      });
      daysContainer.append(dayElement);
    }

    this.setSelected(daysContainer, this.selectedDate);
    this.daysElement.replaceChildren(daysContainer);
  }

  renderMonths() {
    this.monthElement.textContent = this.displayedDate.getFullYear().toString();
    this.weekDays.style = 'display: none;';
    this.daysElement.classList.replace('days', 'months');

    this.writeDataset(this.monthElement, undefined, undefined, undefined, 'renderYears')
    this.writeDataset(this.prevMonthElement, this.displayedDate.getFullYear() - 1, this.displayedDate.getMonth(),
      '', 'parseDateFromElement');
    this.writeDataset(this.nextMonthElement, this.displayedDate.getFullYear() + 1, this.displayedDate.getMonth(),
      '', 'parseDateFromElement');

    this.calendar.dataset.status = 'Months';
    const monthsContainer = document.createDocumentFragment();

    for (let i = 0; i < 12; i++) {
      const month = MONTHS[i];
      const monthEl = createEl('div', 'day', month);

      this.writeDataset(monthEl, this.displayedDate.getFullYear(), i, '', 'parseDateFromElement');
      monthEl.dataset.mode = 'Days';

      monthsContainer.append(monthEl);
    }

    this.daysElement.replaceChildren(monthsContainer);
  }

  renderYears() {
    const curYear = this.displayedDate.getFullYear();
    this.monthElement.textContent = curYear + ' - ' + (curYear + 9);
    this.calendar.dataset.status = 'Years';

    this.writeDataset(this.prevMonthElement, this.displayedDate.getFullYear() - 10,
      this.displayedDate.getMonth(), '', 'parseDateFromElement');
    this.writeDataset(this.nextMonthElement, this.displayedDate.getFullYear() + 10,
      this.displayedDate.getMonth(), '', 'parseDateFromElement');

    const yearsContainer = document.createDocumentFragment();

    for (let i = 0; i < 12; i++) {
      const year = curYear - 1 + i;

      const yearEl = createEl('div', 'day', String(year));
      this.writeDataset(yearEl, year, this.displayedDate.getMonth(), '', 'parseDateFromElement');
      yearEl.dataset.mode = 'Months';

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
      inputFieldValue = formatDate(this.displayedDate).split('');
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
      ev.target.value = formatDate(this.displayedDate);
      ev.target.selectionStart = ev.target.selectionEnd = cursorPosition;
      return;
    }

    inputFieldValue[cursorPosition] = inputChar;

    let inpDay = parseInt(inputFieldValue[0] + inputFieldValue[1]);
    let inpMonth = parseInt(inputFieldValue[3] + inputFieldValue[4]) - 1;
    let inpYear = parseInt(inputFieldValue[6] + inputFieldValue[7] + inputFieldValue[8] + inputFieldValue[9]);

    const lastDay = getLastDayOfMonth(this.displayedDate).getDate();

    if (inpDay > lastDay) {
      inpDay = lastDay;
    } else if (inpDay === 0) {
      inpDay = 1;
    }
    if (inpMonth > 11) {
      inpMonth = 11;
    } else if (inpMonth === -1) {
      inpMonth = 0;
    }
    if (inpYear < 1000) {
      inpYear = 1900;
    }

    this.displayedDate.setDate(inpDay);

    this.writeDataset(ev.target, {
      year: inpYear,
      month: inpMonth,
      day: inpDay
    });
    this.parseDateFromElement(ev.target);

    ev.target.selectionStart = ev.target.selectionEnd = cursorPosition + 1;
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
    this.writeDataset(this.todayBtn, {
      year: this.displayedDate.getFullYear(),
      month: this.displayedDate.getMonth(),
      day: this.displayedDate.getDate(),
      action: 'parseDateFromElement'
    });


    this.calendar.append(monthHeader, this.weekDays, this.daysElement, this.todayBtn);

    this.calendar.addEventListener('click', this);
    this.inputElement.addEventListener('focus', this);
    this.inputElement.addEventListener('blur', this);
    this.inputElement.addEventListener('input', this);

    this.container.append(this.inputElement, this.calendar);

    this.renderDays();
  }
}


//Helper Functions
function setInputFieldValue(input, date) {
  input.value = formatDate(date);
}

function getLastDayOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

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