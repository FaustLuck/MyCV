/**
 * Открытие/Закрытие меню
 * @param {Event} e - событие клика на меню
 */
function toggleMenu(e, flag = true) {
  if (flag) {
    if (window.matchMedia('(min-width: 768px)').matches) return;
    if (!(e.target.closest('.menu') || e.target.closest('.burger') || e.target.closest('.overley:not(form'))) return;
    console.log(e)
  }
  let menu = document.querySelector('.menu');
  menu.classList.toggle('open');
  flag = menu.classList.contains('open');
  document.querySelector('.writing').classList.toggle('left', flag);
  toggleOverley(flag);
  toggleBurger(flag);
}

/**
 * Скрывает/отображает значок меню 
 * @param {Boolean} flag - если true -> скрыть значок
 */
function toggleBurger(flag) {
  let burger = document.querySelector('.burger');
  burger.classList.toggle('hide', flag)
}

/**
 * Скрывает/отображает оверлей
 * @param {Boolean} flag - если true -> отобразить оверлей
 */
function toggleOverley(flag, form = '') {
  if (form) form = `.${form}`
  let overley = document.querySelector(`.overley${form}`);
  overley.classList.toggle('open', flag);
  toggleOverflow(flag)
}

/**
 * Скрывает/отображает полосы прокрутки
 * @param {Boolean} flag - если true -> скрыть полосы
 */
function toggleOverflow(flag) {
  document.body.classList.toggle('fixed', flag)
}

/**
 * Проверка сохранена ли предпочитаемая тема
 */
function checkTheme() {
  let isDark = window.localStorage.getItem('dark');
  if (isDark == 'false' || isDark == null) {
    window.localStorage.setItem('dark', 'false')
    document.body.classList.add('light')
  } else {
    window.localStorage.setItem('dark', 'true')
    document.body.classList.add('dark')
  }
  toggleIcon()
}

/**
 * Переключение иконок в зависимости от темы
 */
function toggleIcon() {
  let icons = document.querySelectorAll('.icon');
  icons = Array.from(icons);
  icons = icons.map(toggleSrc)
}

/**
 * Редактирование путей иконок в зависимости от темы
 * @param {Object} el - иконка путь которой надо заменить
 */
function toggleSrc(el) {
  let sep = (window.localStorage.getItem('dark') == 'true') ? 'dark' : 'light';
  let newSep = (window.localStorage.getItem('dark') == 'true') ? 'light' : 'dark';
  let tmp = el.src.split(sep)
  tmp = tmp.join(newSep)
  el.src = tmp
}

/**
 * Переключение темы
 * @param {Event} e - событие клика переключения темы
 */
function toggleTheme(e) {
  if (!e.target.closest('.theme')) return;
  let isDark = window.localStorage.getItem('dark')
  isDark = (isDark == 'true') ? false : true;
  window.localStorage.setItem('dark', isDark)
  document.body.classList.toggle('dark', isDark)
  document.body.classList.toggle('light', !isDark)
  toggleIcon()
}

/**
 * Прячет/передвигает иконку чата
 * @param {Boolean} flag - если true - прячет иконку
 */
function toggleWritingIcon(flag) {
  let writingIcon = document.querySelector('.writing')
  writingIcon.classList.toggle('hide', flag)
  writingIcon.classList.remove('left')
}


/**
 * 
 * @param {*} e 
 * @returns 
 */
function toggleForm(e) {
  if (!(e.target.closest('.writing') || e.target.closest('.close'))) return;
  let popup = document.querySelector('.popup');
  if (e.target.closest('.close')) document.forms[0].reset();
  popup.classList.toggle('open')
  let flag = popup.classList.contains('open');
  (flag) ? addListeners() : removeListeners()
  let overley_menu = document.querySelector('.overley')
  if (overley_menu.classList.contains('open')) toggleMenu(null, !flag)
  toggleOverley(flag, 'form')
  toggleWritingIcon(flag)
}

/**
 * Закрывает меню, если после смены ориентации оно стало прибито к потолку
 */
function closeMenu() {
  if (window.matchMedia('(min-width: 768px) and (orientation:landscape)').matches) {
    let overley_menu = document.querySelector('.overley');
    let flag = overley_menu.classList.contains('open');
    if (flag) toggleMenu(null, !flag)
  }
}

/**
 * Проверка адреса эл. почты
 * @param {String} email - адрес электронной почты
 * @returns {Boolean} true если проверка пройдена
 */
function validateEmail(e) {
  let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  let email = e.target.value;
  let flag = email.match(regex)
  e.target.classList.toggle('invalid', !flag)
  return flag
}

/**
 * Проверяет значение на заполненность
 * @param {Event} e 
 */
function isEmpty(e) {
  let value = e.target.value;
  let flag = Boolean(value);
  e.target.classList.toggle('invalid', !flag)
}

/**
 * Проверяет данные в форме на валидность
 */
function validateForm() {
  let form = document.forms[0];
  let submit = form.querySelector('.submit')
  if (form.bucket.value) return false
  let invalid = Boolean(form.querySelectorAll('.invalid').length)
  submit.classList.toggle('inactive', invalid)
  if (!invalid) submit.addEventListener('click', setData)
}

/**
 * Добавляет обработчики ввода в форме
 */
function addListeners() {
  let form = document.forms[0];
  let inputs = form.querySelectorAll('input');
  let textarea = form.querySelector('textarea');
  inputs = [...inputs, textarea];
  inputs.forEach(el => {
    if (el.type == 'email') return el.addEventListener('input', validateEmail)
    if (el.classList.contains('bucket')) return;
    el.addEventListener('input', isEmpty)
  })
}

/**
 * Удаляет обработчики ввода в форме
 */
function removeListeners() {
  let form = document.forms[0];
  let inputs = form.querySelectorAll('input');
  let textarea = form.querySelector('textarea');
  inputs = [...inputs, textarea];
  inputs.forEach(el => {
    if (el.type == 'email') return el.removeEventListener('input', validateEmail)
    if (el.classList.contains('bucket')) return;
    el.removeEventListener('input', isEmpty)
  })
}


import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js'
import { getDatabase, ref, set } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js'

const firebaseConfig = {
  apiKey: "AIzaSyCukmuh4VplvLpM3XQzlkGCuyGgX7x2y18",
  authDomain: "grastor-messagestorage.firebaseapp.com",
  databaseURL: "https://grastor-messagestorage-default-rtdb.firebaseio.com",
  projectId: "grastor-messagestorage",
  storageBucket: "grastor-messagestorage.appspot.com",
  messagingSenderId: "189811633204",
  appId: "1:189811633204:web:cddbbdee2964375bd86e61",
  measurementId: "G-G4SXGQZLE1"
};

const app = initializeApp(firebaseConfig);
const done = {
  ru: 'Данные записаны',
  en: 'Data recorded'
};
const errors = {
  ru: 'Что-то пошло не так',
  en: 'Something went wrong'
}

/**
 * Отправка данных в firebase-database
 * @param {Object} e - событие отправки формы
 * @param {Number} e.id - ID сообщения (строка с датой отправки)
 * @param {Object} e.data - данные сообщения
 */
function setData() {
  let lang = document.documentElement.lang;
  showPreloader();
  let id = createIDmsg();
  let data = createData();
  if (typeof (data) == 'string') return alert(data)
  const db = getDatabase();
  set(ref(db, 'messages/' + id), data)
    .then(() => {
      showResult(done[lang]);
      setTimeout(returnStyles, 1000)
    })
    .catch((error) => {
      showResult(errors[lang], error);
      setTimeout(returnStyles, 1000)
    });
}

/**
 * Создание ID сообщения на основании времени отправки
 * @returns {String} - строка с датой отправки
 */
function createIDmsg() {
  let str = (new Date).toLocaleString('ru-RU');
  str = str.replaceAll(/[\.:]/g, '-').replace(/,/, '')
  return str
}

/**
 * создание объекта для сохранения сообщения
 * @param {Object} e - событие отправки формы
 * @returns {Object} - объект для записи в БД
 */
function createData() {
  let form = document.forms[0];
  return {
    name: form.name.value,
    email: form.email.value,
    message: form.message.value
  }
}

/**
 * Сбрасывает стили на стандартные
 */
function returnStyles() {
  let output = document.querySelector('.result');
  output.textContent = ''
  output.classList.remove('show');
  output.classList.remove('error');
  let form = document.forms[0];
  form.reset();
  form.removeAttribute('style')
  form.querySelector('.container').removeAttribute('style');
  document.querySelector('.popup').classList.remove('open')
  document.querySelector('.overley.form').classList.remove('open')
}

/**
 * Показывает результат отправки данных в БД
 * @param {String} result - результат записи данных в БД
 * @param {Error} error - ошибка записи данных в БД
 */
function showResult(result, error = false) {
  let preloader = document.querySelector('.preloader');
  let output = document.querySelector('.result');
  preloader.classList.remove('show');
  output.classList.add('show');
  if (error) {
    output.classList.add('error');
    console.log(error)
  }
  output.textContent = result
}

/**
 * Показывает прелоадер, пока ожидается ответ от Бд
 */
function showPreloader() {
  let preloader = document.querySelector('.preloader');
  let form = document.forms[0];
  let [width, height] = [form.offsetWidth - 96, form.offsetHeight - 96]
  form.querySelector('.container').style.display = 'none'
  form.style.width = width + 'px';
  form.style.height = height + 'px';
  preloader.classList.add('show')
}

document.addEventListener('click', toggleMenu)
document.addEventListener('DOMContentLoaded', checkTheme)
document.addEventListener('click', toggleTheme)
document.addEventListener('click', toggleForm)
window.addEventListener('resize', closeMenu)
document.querySelector('form').addEventListener('input', validateForm)