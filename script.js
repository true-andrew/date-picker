// const selectedDateElement = document.querySelector('.selected-date');
// const monthElement = document.querySelector('.mth');
// const nextMonthElement = document.querySelector('.next-mth');
// const prevMonthElement = document.querySelector('.prev-mth');
// const daysElement = document.querySelector('.days');
// const weekDays = document.querySelector('.weekDays');
//
// const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
// const weekDayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
//
//
// let date = new Date();
// let day, month, year;
//
// let selectedDate = new Date();
// let selectedDay, selectedMonth, selectedYear;
//
// monthElement.textContent = months[selectedDate.getMonth()] + ' ' + selectedDate.getFullYear();
// selectedDateElement.value = formatDate(selectedDate);
//
// for (let dayName of weekDayNames) {
//   weekDays.innerHTML += `<div>${dayName}</div>`
// }
//
// populateDates();
//
// // EVENT LISTENERS
// selectedDateElement.addEventListener('input', handleChange);
// nextMonthElement.addEventListener('click', goToNextMonth);
// prevMonthElement.addEventListener('click', goToPrevMonth);
//
// // FUNCTIONS
// function goToNextMonth() {
//   month++;
//   if (month === 12) {
//     month = 0;
//     year++;
//     date.setFullYear(year);
//   }
//   date.setMonth(month);
//   monthElement.textContent = months[month] + ' ' + year;
//   selectedDateElement.value = formatDate(selectedDate);
//   populateDates();
// }
//
// function goToPrevMonth() {
//   month--;
//   if (month === -1) {
//     month = 11;
//     year--;
//     date.setFullYear(year);
//   }
//   date.setMonth(month);
//   monthElement.textContent = months[month] + ' ' + year;
//   selectedDateElement.value = formatDate(selectedDate);
//   populateDates();
// }
//
// function populateDates() {
//   daysElement.innerHTML = '';
//   day = date.getDate();
//   month = date.getMonth();
//   year = date.getFullYear();
//
//   selectedDay = selectedDate.getDate();
//   selectedMonth = selectedDate.getMonth();
//   selectedYear = selectedDate.getFullYear();
//
//   let amount_days = new Date(year, month + 1, 0).getDate();
//   let curMonthFirstDayIndex = getLocalDay(new Date(year, month, 1));
//   let lastDayMonthBefore = new Date(year, month, 0).getDate();
//   let curMonthEndDayIndex = getLocalDay(new Date(year, month + 1, 0));
//   let firstDayNextMonth = 1;
//
//
//   for (let i = curMonthFirstDayIndex - 1; i >= 1; i--) {
//     const dayElement = document.createElement('div');
//     dayElement.classList.add('day', 'prev');
//     dayElement.textContent = String(lastDayMonthBefore - i + 1);
//     daysElement.appendChild(dayElement);
//
//     dayElement.addEventListener('click', function () {
//       selectedDate = new Date(year, month - 1, lastDayMonthBefore - i + 1);
//       selectedDateElement.value = formatDate(selectedDate);
//     });
//
//     dayElement.addEventListener('click', goToPrevMonth);
//   }
//
//   for (let i = 0; i < amount_days; i++) {
//     const dayElement = document.createElement('div');
//     dayElement.classList.add('day');
//     dayElement.textContent = String(i + 1);
//
//     if (selectedDay === (i + 1) && selectedYear === year && selectedMonth === month) {
//       dayElement.classList.add('selected');
//     }
//
//     dayElement.addEventListener('click', function () {
//       selectedDate = new Date(year, month, i + 1);
//       selectedDateElement.value = formatDate(selectedDate);
//       populateDates();
//     });
//
//     daysElement.appendChild(dayElement);
//   }
//
//   for (let i = curMonthEndDayIndex + 1; i <= 7; i++) {
//     const dayElement = document.createElement('div');
//     const dayNumber = firstDayNextMonth;
//     dayElement.classList.add('day', 'next');
//     dayElement.textContent = String(firstDayNextMonth++);
//     daysElement.appendChild(dayElement);
//
//     dayElement.addEventListener('click', function () {
//       selectedDate = new Date(year, month + 1, dayNumber);
//       selectedDateElement.value = formatDate(selectedDate);
//     });
//
//     dayElement.addEventListener('click', goToNextMonth);
//   }
// }
//
// function handleChange(e) {
//   let input = e.target.value;
//   let testRegExr = /^(\d{2})\.(\d{2})\.(\d{4})$/;
//   let test = input.match(testRegExr);
//
//   if (test) {
//     const [, inpDay, inpMonth, inpYear] = test;
//     date = new Date(inpYear + '-' + inpMonth + '-' + inpDay);
//     if (date.toString() === 'Invalid Date') {
//       alert('Неправильное значение даты');
//       return;
//     }
//     selectedDate = new Date(date);
//     monthElement.textContent = months[date.getMonth()] + ' ' + date.getFullYear();
//     populateDates();
//   }
// }
//
// // function getLocalDay(date) {
// //
// //   let day = date.getDay();
// //
// //   if (day === 0) {
// //     day = 7;
// //   }
// //
// //   return day;
// // }
//
// // function formatDate(d) {
// //   let day = d.getDate();
// //   if (day < 10) {
// //     day = '0' + day;
// //   }
// //
// //   let month = d.getMonth() + 1;
// //   if (month < 10) {
// //     month = '0' + month;
// //   }
// //
// //   let year = d.getFullYear();
// //
// //   return day + '.' + month + '.' + year;
// // }