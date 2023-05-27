/**
 * Открытие/Закрытие меню
 * @param {Event} e - событие клика на меню
 * @param flag
 */
function toggleMenu(e, flag = true) {
  if (flag) {
    if (window.matchMedia("(min-width: 768px)").matches) return;
    if (!(e.target.closest(".menu") || e.target.closest(".burger") || e.target.closest(".overlay:not(form)"))) return;
  }
  let menu = document.querySelector(".menu");
  menu.classList.toggle("open");
  flag = menu.classList.contains("open");
  document.querySelector(".writing").classList.toggle("left", flag);
  toggleOverlay(flag);
  toggleBurger(flag);
}

/**
 * Скрывает/отображает значок меню
 * @param {Boolean} flag - если true -> скрыть значок
 */
function toggleBurger(flag) {
  let burger = document.querySelector(".burger");
  burger.classList.toggle("hide", flag);
}

/**
 * Скрывает/отображает оверлей
 * @param {Boolean} flag - если true -> отобразить оверлей
 * @param form
 */
function toggleOverlay(flag, form = "") {
  if (form) form = `.${form}`;
  let overlay = document.querySelector(`.overlay${form}`);
  overlay.classList.toggle("open", flag);
  toggleOverflow(flag);
}

/**
 * Скрывает/отображает полосы прокрутки
 * @param {Boolean} flag - если true -> скрыть полосы
 */
function toggleOverflow(flag) {
  document.body.classList.toggle("fixed", flag);
}

/**
 * Проверка сохранена ли предпочитаемая тема
 */
function checkTheme() {
  let isDark = window.localStorage.getItem("dark");
  isDark = (isDark === null) ? checkPreferColorScheme() : isDark === "true";
  document.body.classList.toggle("dark", isDark);
  document.body.classList.toggle("light", !isDark);
  toggleIcon(isDark);
}

function checkPreferColorScheme() {
  return window.matchMedia("(prefers-color-scheme:dark)").matches;
}

/**
 * Сохраняет выбранную тему
 * @param isDark {Boolean}
 */
function savePreferTheme(isDark) {
  window.localStorage.setItem("dark", `${isDark}`);
}

/**
 * Переключение иконок в зависимости от темы
 */
function toggleIcon(isDark) {
  let icons = document.querySelectorAll(".icon");
  let [oldSep, newSep] = isDark ? ["dark", "light"] : ["light", "dark"];
  icons.forEach(icon => {
    icon.src = icon.src.replaceAll(oldSep, newSep);
  });
}

/**
 * Переключение темы
 * @param {Event} e - событие клика переключения темы
 */
function toggleTheme(e) {
  if (!e.target.closest(".theme")) return;
  let isDark = !document.body.classList.contains("dark");
  document.body.classList.toggle("dark", isDark);
  document.body.classList.toggle("light", !isDark);
  savePreferTheme(isDark);
  toggleIcon(isDark);
}

/**
 * Прячет/передвигает иконку чата
 * @param {Boolean} flag - если true - прячет иконку
 */
function toggleWritingIcon(flag) {
  let writingIcon = document.querySelector(".writing");
  writingIcon.classList.toggle("hide", flag);
  writingIcon.classList.remove("left");
}

/**
 *
 * @param {Event} e - событие открытия/закрытия формы
 * @returns
 */
function toggleForm(e) {
  if (!(e.target.closest(".writing") || e.target.closest(".close"))) return;
  let popup = document.querySelector(".popup");
  if (e.target.closest(".close")) document.forms[0].reset();
  popup.classList.toggle("open");
  let flag = popup.classList.contains("open");
  (flag) ? addListeners() : removeListeners();
  let overlay_menu = document.querySelector(".overlay");
  if (overlay_menu.classList.contains("open")) toggleMenu(null, !flag);
  toggleOverlay(flag, "form");
  toggleWritingIcon(flag);
}

/**
 * Закрывает меню, если после смены ориентации оно стало прибито к потолку
 */
function closeMenu() {
  if (window.matchMedia("(min-width: 768px) and (orientation:landscape)").matches) {
    let overlay_menu = document.querySelector(".overlay");
    let flag = overlay_menu.classList.contains("open");
    if (flag) toggleMenu(null, !flag);
  }
}

/**
 * Проверка адреса эл. почты
 * @returns {Boolean} true если проверка пройдена
 */
function validateEmail(e) {
  let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  let email = e.target.value;
  let flag = email.match(regex);
  e.target.classList.toggle("invalid", !flag);
  return flag;
}

/**
 * Проверяет значение на заполненность
 * @param {Event} e - событие набора текста
 */
function isEmpty(e) {
  let value = e.target.value;
  let flag = Boolean(value);
  e.target.classList.toggle("invalid", !flag);
}

/**
 * Проверяет данные в форме на валидность
 */
function validateForm() {
  let form = document.forms[0];
  let submit = form.querySelector(".submit");
  if (form.bucket.value) return false;
  let invalid = Boolean(form.querySelectorAll(".invalid").length);
  submit.classList.toggle("inactive", invalid);
  if (!invalid) submit.addEventListener("click", saveMessage);
}

/**
 * Добавляет обработчики ввода в форме
 */
function addListeners() {
  let form = document.forms[0];
  let inputs = form.querySelectorAll("input");
  let textarea = form.querySelector("textarea");
  inputs = [...inputs, textarea];
  inputs.forEach(el => {
    if (el.type === "email") return el.addEventListener("input", validateEmail);
    if (el.classList.contains("bucket")) return;
    if (el.type === "radio") return;
    el.addEventListener("input", isEmpty);
  });
}

/**
 * Удаляет обработчики ввода в форме
 */
function removeListeners() {
  let form = document.forms[0];
  let inputs = form.querySelectorAll("input");
  let textarea = form.querySelector("textarea");
  inputs = [...inputs, textarea];
  inputs.forEach(el => {
    if (el.type === "email") return el.removeEventListener("input", validateEmail);
    if (el.classList.contains("bucket")) return;
    if (el.type === "radio") return;
    el.removeEventListener("input", isEmpty);
  });
}

const done = {
  ru: "Данные записаны",
  en: "Data recorded"
};
const errors = {
  ru: "Что-то пошло не так",
  en: "Something went wrong"
};
const sayThanks = {
  ru: "Благодарю за оценку",
  en: "Thank you for rating"
};

/**
 * Отправка данных в firebase-database
 */
async function saveMessage() {
  let lang = document.documentElement.lang;
  showPreloader();
  let data = createData();
  let res = await fetch(`https://englishspace-1-g1233964.deta.app/cv/message`, {
    headers: {"Content-Type": "application/json"},
    method: "POST",
    body: JSON.stringify(data)
  });
  if (res.ok) {
    showResult(done[lang]);
  } else {
    showResult(errors[lang], true);
  }
  setTimeout(returnStyles, 1000);
}

/**
 * создание объекта для сохранения сообщения
 * @returns {Object} - объект для записи в БД
 */
function createData() {
  let form = document.forms[0];
  return {
    timestamp: Date.now(),
    name: form.name.value,
    email: form.email.value,
    message: form.message.value
  };
}

/**
 * Сбрасывает стили на стандартные
 */
function returnStyles() {
  let output = document.querySelector(".result");
  output.textContent = "";
  output.classList.remove("show");
  output.classList.remove("error");
  let form = document.forms[0];
  form.reset();
  form.removeAttribute("style");
  form.querySelector(".container").removeAttribute("style");
  document.querySelector(".popup").classList.remove("open");
  document.querySelector(".overlay.form").classList.remove("open");
  document.body.classList.remove("fixed");
  toggleWritingIcon();
}

/**
 * Показывает результат отправки данных в БД
 * @param {String} result - результат записи данных в БД
 * @param {boolean} error - ошибка записи данных в БД
 */
function showResult(result, error = false) {
  let preloader = document.querySelector(".preloader");
  let output = document.querySelector(".result");
  preloader.classList.remove("show");
  output.classList.add("show");
  if (error) output.classList.add("error");
  output.textContent = result;
}

/**
 * Показывает preloader, пока ожидается ответ от Бд
 */
function showPreloader() {
  let preloader = document.querySelector(".preloader");
  let form = document.forms[0];
  let [width, height] = [form.offsetWidth - 96, form.offsetHeight - 96];
  form.querySelector(".container").style.display = "none";
  form.style.width = width + "px";
  form.style.height = height + "px";
  preloader.classList.add("show");
}

/**
 * Получение значения рейтинга из БД
 */
async function getRating() {
  let res = await fetch(`https://englishspace-1-g1233964.deta.app/cv/get`);
  if (res.ok) {
    const data = await res.json();
    showRating(data);
  }
}

/**
 * Отпровляет в БД новые данные по рейтингу
 * @param {Event} e - выбор оценки пользователя
 */
async function updateRating(e) {
  if (e.target.closest(".star_rating").classList.contains("hide")) return;
  let value = +e.target.value;
  let res = await fetch(`https://englishspace-1-g1233964.deta.app/cv/${value}`);
  if (res.ok) {
    window.localStorage.setItem("voted", "true");
    const data = await res.json();
    toggleRatingStyles(false, data);
  } else {
    e.target.checked = false;
    toggleRatingStyles(true);
  }
}

/**
 * После голосования последовательно
 * 1) убирает блок со звездами, вместо него говорит "Спасибо"
 * 2) убирает благодарности и показывает статистику голосования
 */
function toggleRatingStyles(errorFlag, data = null) {
  let lang = document.documentElement.lang;
  let thanks = document.querySelector(".thanks");
  let stars = document.querySelector(".star_rating");
  let ratingResult = document.querySelector(".star_rating_result");
  stars.classList.add("hide");
  thanks.textContent = (errorFlag) ? errors[lang] : sayThanks[lang];
  thanks.classList.remove("hide");
  setTimeout(() => {
    thanks.classList.add("hide");
    (errorFlag) ? stars.classList.remove("hide") : ratingResult.classList.remove("hide");
    if (data) showRating(data);
  }, 2000);
}

/**
 * Подставляет значения в строку
 * @param {Object} param - принимает объект
 * @param {Number} param.count - количество голосов
 * @param {Number} param.rating - средняя оценка
 */
function showRating({count, rating}) {
  let elem = document.querySelector(".star_rating_result");
  updateRatingDigits(+rating);
  elem.querySelector(".count").textContent = `${count}`;
  if (window.localStorage.getItem("voted") === "true") {
    document.querySelector(".star_rating").classList.add("hide");
    elem.classList.remove("hide");
  }
}

/**
 * Скроллинг цифр
 * @param {HTMLElement} el - контейнер с числами для сдвига
 * @param {Number} endDigit - конечное число
 */
function scrollDigit(el, endDigit) {
  let startTop = getTopNumber(el);
  let endTop = endDigit * (-16);
  let offset = (endTop - startTop) / 100;
  let start = setInterval(() => {
    el.style.marginTop = getTopNumber(el) + offset + "px";
    if (getTopNumber(el) === endDigit * (-16)) clearInterval(start);
  }, 10);
}

/**
 * возвращает значение margin-top элемента
 * @param {HTMLElement} el - контейнер с числом
 * @returns {Number} margin-top элемента
 */
function getTopNumber(el) {
  let offset = window.getComputedStyle(el).marginTop;
  return +offset.split("px")[0];
}

/**
 * обновляет значение рейтинга в форме
 * @param {Number} rating - значения рейтинга
 */
function updateRatingDigits(rating) {
  let digits = document.querySelectorAll(".digits");
  let ratingDigits = `${rating}`;
  ratingDigits = (ratingDigits.includes(".")) ? ratingDigits.padEnd(4, "0") : `${ratingDigits}.00`;
  ratingDigits = ratingDigits.split("").filter(e => e !== ".");
  digits.forEach((el, i) => scrollDigit(el, ratingDigits[i]));
}

/**
 * Отправляет запрос на адрес в el.href
 * @param {HTMLElement} el - элемент для которого необходим предпросмотр
 * @returns {String} HTML единой строкой
 */
async function fetchData(el) {
  let href = el.target.href;
  let response = await fetch(href);
  let text;
  if (response.ok) {
    text = await response.text();
  } else {
    console.log(`Не удалось получить данные с ${href}`);
  }
  return text;
}

/**
 * Делит строку с HTML
 * @param {String} el - HTML единой строкой
 * @returns {[String]} HTML разделенный на строки
 */
function splitData(el) {
  return el.split(/>(\\n)?(\s+)?</).filter(e => e);
}

/**
 * Извекает данные OG
 * @param {String} el - HTML строка
 * @returns {Object} - данные из HTML в удобном формате (свойство: значение)
 */
function createInfo(el) {
  return {
    property: getProperty(el),
    value: getContent(el)
  };
}

/**
 * фильтрует данные с OG
 * @param {[String]} el - массив HTML строк
 * @returns {Object} данные для подстановки в карточку .preview
 */
function createOG_object(el) {
  return el
    .filter(e => e.indexOf("og:") > -1)
    .map(e => e.replaceAll("\"", ""))
    .map(createInfo);

}

/**
 * Подготавливает даннеы для записи в HTML теги
 * @param {Object} data - данные
 * @returns {Object} подготовленные данные
 */
function prepareData(data) {
  let output = {};
  output.title = data.find(e => e.property === "title").value;
  output.description = data.find(e => e.property === "description").value;
  let url = data.find(e => e.property === "url").value;
  let src = data.find(e => e.property === "image").value.replace("./", "");
  output.src = url + src;
  return output;
}

/**
 * Возвращает название OG свойства
 * @param {String} str - HTML строка
 * @returns {String} - OG свойство
 */
function getProperty(str) {
  let search = "og:";
  let start = str.indexOf(search);
  let end = str.indexOf(" ", start);
  return str.substring(start + search.length, end);
}

/**
 * Возвращает OG значение
 * @param {String} str - HTML строка
 * @returns {String} - OG значение
 */
function getContent(str) {
  let search = "content=";
  let start = str.indexOf(search);
  return str.substring(start + search.length, str.length);
}

/**
 * если устройство пользователя может выполнить hover, показать примеры сайтов
 */
async function checkMedia() {
  if (!window.matchMedia("(any-hover: hover)").matches) return;
  let examples = document.querySelectorAll(".example");
  examples = Array.from(examples);
  let tmp = examples.map(checkStorage);
  let readyToAdd = [];
  let mustFetch = [];
  tmp.forEach(e => {
    (e.hasOwnProperty("src")) ? readyToAdd.push(e) : mustFetch.push(e);
  });
  if (mustFetch.length) {
    mustFetch = await Promise.all([...mustFetch].map(fetchData));
    mustFetch = mustFetch.map(splitData).map(createOG_object).map(prepareData);
    saveData(mustFetch);
    mustFetch.map(el => {
      el.target = examples.find(e => e.text === el.title);
    });
  }
  readyToAdd = [...readyToAdd, ...mustFetch];
  readyToAdd.forEach(addData);
}

/**
 * Сохранение данных в LocalStorage
 * @param {[String]} array - данные для сохранения
 */
function saveData(array) {
  array.forEach(el => {
    let obj = {
      description: el.description,
      src: el.src
    };
    window.localStorage.setItem(el.title, JSON.stringify(obj));
  });
}

/**
 * Запись данных в карточку .preview
 * @param {Object} data - данные
 */
function addData(data) {
  let target = data.target.closest(".examples__item");
  let preview = target.querySelector(".empty");
  let title = target.querySelector(".preview_title");
  let description = target.querySelector(".preview_description");
  let img = target.querySelector(".preview_img");
  title.textContent = data.title;
  description.textContent = data.description;
  img.src = data.src;
  preview.classList.remove("empty");
}

/**
 * Проверка хранилища на запрашиваемые данные
 * @param {HTMLElement} target - элемент .preview, которому необходимо заполнить данные
 * @returns {HTMLElement | Object} если checkValue=true => вернет исходный элемент,
 *  в противном случае объект для заполнения
 */
function checkStorage(target) {
  let obj = JSON.parse(window.localStorage.getItem(target.textContent));
  let output = {...obj};
  output.target = target;
  output.title = target.textContent;
  return (checkValue(output)) ? target : output;
}

/**
 * Проверяет value на заполненность
 * @param {Event} value - событие ввода
 * @returns {Boolean} - true если value неопределено
 */
function checkValue(value) {
  return ((Object.values(value)).some(e => e == null || undefined));
}

document.addEventListener("DOMContentLoaded", checkMedia);
document.addEventListener("DOMContentLoaded", checkTheme);
document.addEventListener("DOMContentLoaded", getRating);
document.addEventListener("DOMContentLoaded", showRating);
document.addEventListener("click", toggleMenu);
document.addEventListener("click", toggleTheme);
document.addEventListener("click", toggleForm);
document.querySelector("form").addEventListener("input", validateForm);
document.querySelector(".star_rating").addEventListener("change", updateRating);
window.addEventListener("resize", closeMenu);