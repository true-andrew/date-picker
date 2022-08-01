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
  viewMode = undefined;
  //regexp
  regExDelete = /delete/;
  regExIsNumber = /\d/;
  regExIsNotNumber = /\D/;

  constructor(id) {
    this.container = document.getElementById(id);
    this.displayedDate = new Date();
    this.render();
  }

  handleEvent(ev) {
    const eventName = 'handleEvent_'+ ev.type;
    if (this[eventName] !== undefined) {
      this[eventName](ev);
    } else {
      throw new Error('Unhandled event');
    }
  }

  handleEvent_blur(ev) {
    if ((ev.relatedTarget === this.calendar) || (ev.relatedTarget === this.todayBtn)) {
      return;
    }

    this.hide();
  }

  handleEvent_focus(ev) {
    this.show();
  }

  handleEvent_click(ev) {
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

  setInputFieldValue(date) {
    this.inputElement.value = formatDate(date);
  }

  setDate(date) {
    if (isNaN(Date.parse(date))) {
      throw new Error('Incorrect Date');
    }
    this.selectedDate = new Date(date);
    this.setInputFieldValue(this.selectedDate);
    this.renderDays(this.selectedDate.getFullYear(), this.selectedDate.getMonth());
  }

  parseDateFromElement(el) {
    const {year, month, day} = el.dataset;
    return new Date(year, month, day);
  }

  pickDate(el) {
    this.setDate(this.parseDateFromElement(el));
  }

  navigateCalendar(el) {
    if (el.dataset.mode) {
      this.viewMode = el.dataset.mode;
    }
    this.renderCalendar(el.dataset.year, el.dataset.month);
  }

  renderCalendar(year, month) {
    if (this.viewMode === 'days') {
      this.renderDays(year, month);
    } else if (this.viewMode === 'months') {
      this.renderMonths(year);
    } else if (this.viewMode === 'years') {
      this.renderYears(year);
    } else {
      throw new Error(`Incorrect view mode: ${this.viewMode}`);
    }
  }

  setSelectedElement(daysContainer, date) {
    const arr = daysContainer.children;
    for (let i = 0, len = arr.length; i < len; i++) {
      const el = arr[i];
      if (el.dataset.year === date.getFullYear().toString()
        && el.dataset.month === date.getMonth().toString()
        && el.dataset.day === date.getDate().toString()) {
        el.classList.add('selected');
      } else if (el.classList.contains('selected')) {
        el.classList.remove('selected');
      }
    }
  }

  renderDays(year, month) {
    this.daysElement.classList.replace('months', 'days');

    const equalMonth = this.displayedDate.getMonth() === +month;
    const equalYear = this.displayedDate.getFullYear() === +year;

    if (this.selectedDate && equalMonth && equalYear) {
      this.setSelectedElement(this.daysElement, this.selectedDate);
      return;
    } else {
      this.displayedDate.setFullYear(year);
      this.displayedDate.setMonth(month);
    }

    const currentMonth = this.displayedDate.getMonth();
    const currentYear = this.displayedDate.getFullYear();

    writeDataset(this.monthElement, {
      year: currentYear,
      mode: 'months',
      action: 'navigateCalendar',
    });
    this.weekDays.style = '';

    const todayDate = new Date();
    const todayDay = todayDate.getDate();
    const todayMonth = todayDate.getMonth();
    const todayYear = todayDate.getFullYear();

    const prevMonth = new Date(currentYear, currentMonth, 0);
    const nextMonth = new Date(currentYear, currentMonth + 1, 1);

    writeDataset(this.prevMonthElement, {
      year: prevMonth.getFullYear(),
      month: prevMonth.getMonth(),
      action: 'navigateCalendar'
    });
    writeDataset(this.nextMonthElement, {
      year: nextMonth.getFullYear(),
      month: nextMonth.getMonth(),
      action: 'navigateCalendar'
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
      const dayElement = createEl('div', 'day prev', String(dayNum), undefined, {
        year: prevMonth.getFullYear(),
        month: prevMonth.getMonth(),
        day: dayNum,
        action: 'pickDate'
      });
      daysContainer.append(dayElement);
    }

    for (let i = 0; i < amountDays; i++) {
      const dayNum = i + 1;
      const dayElement = createEl('div', 'day', String(dayNum), undefined, {
        year: currentYear,
        month: currentMonth,
        day: dayNum,
        action: 'pickDate'
      });

      if (todayDay === (i + 1) && todayMonth === currentMonth && todayYear === currentYear) {
        dayElement.classList.add('today');
      }

      daysContainer.append(dayElement);
    }

    for (let i = curMonthEndDayIndex + 1; i <= 7; i++) {
      const dayNum = firstDayNextMonth++;
      const dayElement = createEl('div', 'day next', String(firstDayNextMonth), undefined, {
        year: nextMonth.getFullYear(),
        month: nextMonth.getMonth(),
        day: dayNum,
        action: 'pickDate'
      });
      daysContainer.append(dayElement);
    }

    if (this.selectedDate) {
      this.setSelectedElement(daysContainer, this.selectedDate);
    }

    this.daysElement.replaceChildren(daysContainer);

  }

  renderMonths(year) {
    this.monthElement.textContent = year;
    const yearNum = parseInt(year);
    this.weekDays.style.display = 'none';
    this.daysElement.classList.replace('days', 'months');

    writeDataset(this.monthElement, {
      year: year,
      mode: 'years',
      action: 'navigateCalendar'
    })
    writeDataset(this.prevMonthElement, {
      year: yearNum - 1,
      action: 'navigateCalendar'
    });
    writeDataset(this.nextMonthElement, {
      year: yearNum + 1,
      action: 'navigateCalendar'
    });

    const monthsContainer = document.createDocumentFragment();

    for (let i = 0; i < 12; i++) {
      const monthName = MONTHS[i];
      const monthEl = createEl('div', 'day', monthName, undefined, {
        year: year,
        month: i,
        mode: 'days',
        action: 'navigateCalendar'
      });

      monthsContainer.append(monthEl);
    }

    this.daysElement.replaceChildren(monthsContainer);
  }

  renderYears(year) {
    this.monthElement.textContent = year + ' - ' + (+year + 9);
    const yearNum = parseInt(year);

    writeDataset(this.prevMonthElement, {
      year: yearNum - 10,
      action: 'navigateCalendar'
    });
    writeDataset(this.nextMonthElement, {
      year: yearNum + 10,
      action: 'navigateCalendar'
    });

    const yearsContainer = document.createDocumentFragment();

    for (let i = 0; i < 12; i++) {
      const yearIterator = year - 1 + i;

      const yearEl = createEl('div', 'day', String(yearIterator), undefined, {
        year: yearIterator,
        mode: 'months',
        action: 'navigateCalendar'
      });

      if (i === 0) {
        yearEl.classList.add('prev');
      } else if (i === 11) {
        yearEl.classList.add('next');
      }

      yearsContainer.append(yearEl);
    }

    this.daysElement.replaceChildren(yearsContainer);
  }

  handleEvent_input(ev) {
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
      inpYear = 1000;
    }

    writeDataset(ev.target, {
      year: inpYear,
      month: inpMonth,
      day: inpDay
    });

    this.pickDate(ev.target);

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

    this.todayBtn = createEl('button', 'btn today', 'Сегодня', undefined, {
      year: this.displayedDate.getFullYear(),
      month: this.displayedDate.getMonth(),
      day: this.displayedDate.getDate(),
      action: 'pickDate'
    });


    this.calendar.append(monthHeader, this.weekDays, this.daysElement, this.todayBtn);

    this.calendar.addEventListener('click', this);
    this.inputElement.addEventListener('focus', this);
    this.inputElement.addEventListener('blur', this);
    this.inputElement.addEventListener('input', this);

    this.container.append(this.inputElement, this.calendar);

    this.viewMode = 'days';

    this.renderCalendar(this.displayedDate.getFullYear(), this.displayedDate.getMonth());
  }
}

//Helper Functions
function writeDataset(el, dataset) {
  for (let key in dataset) {
    el.dataset[key] = dataset[key];
  }
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

function createEl(elName, classList, text, options, dataset) {
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
  if (dataset) {
    writeDataset(el, dataset);
  }
  return el;
}

const calendar1 = new DatePicker('date-picker-1');