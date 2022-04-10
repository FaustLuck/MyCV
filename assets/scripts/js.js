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
 * Переключение темы
 * @param {Event} e - событие клика переключения темы
 */
function toggleTheme(e) {
  if (!e.target.closest('.theme')) return;
  let isDark = window.localStorage.getItem('dark')
  isDark = (isDark == 'true') ? false : true;
  window.localStorage.setItem('dark', isDark)
  document.body.classList.toggle('dark')
  document.body.classList.toggle('light')
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
 * Открытие/Закрытие меню
 * @param {Event} e - событие клика на меню
 */
function toggleMenu(e) {
  if (window.matchMedia('(min-width: 768px)').matches) return;
  let menu = document.querySelector('.menu');
  if (e.target.closest('.writing')) menu.classList.remove('open')
  if (!(e.target.closest('.menu') || e.target.closest('.overley:not(form'))) return
  menu.classList.toggle('open');
  toggleOverley()
}

/**
 * Скрывает/Показывает полосы прокрутки
 * @param {Boolean} flag - true если overley открыт
 */
function showHideOverflow(flag) {
  document.body.style.overflow = (flag) ? 'hidden' : 'auto'
}

/**
 * показывает/скрывает overley
 * @param {String} form - доп класс для overley формы
 */
function toggleOverley(form = '') {
  if (form) form = `.${form}`
  let overley = document.querySelector(`.overley${form}`);
  overley.classList.toggle('open')
  let flag = overley.classList.contains('open')
  showHideOverflow(flag)
}

/**
 * показывает/скрывает форму обратной связи и оверлей
 * @param {Event} e - событие клика
 */
function toggleForm(e) {
  if (!(e.target.closest('.writing') || e.target.closest('.close') || e.target.closest('.submit'))) return;
  let writingIcon = document.querySelector('.writing')
  writingIcon.classList.toggle('hide')
  if (document.querySelector('.overley').classList.contains('open')) toggleOverley()
  toggleOverley('form');
  let form = document.querySelector('.popup');
  form.classList.toggle('open')
}

document.addEventListener('click', toggleMenu)
document.addEventListener('click', toggleTheme)
document.addEventListener('DOMContentLoaded', checkTheme)
document.addEventListener('click', toggleForm)

