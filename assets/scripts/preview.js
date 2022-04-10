/**
 * Отправляет запрос на адрес в el.href
 * @param {HTMLElement} el - элемент для которого необходим предпросмотр
 * @returns {String} HTML единой строкой
 */
async function fetchData(el) {
  let href = el.href
  let response = await fetch(href);
  let text;
  if (response.ok) {
    text = await response.text();
  } else {
    console.log(`Не удалось получить данные с ${href}`);
  }
  return text
}

/**
 * Делит строку с HTML
 * @param {String} el - HTML единой строкой
 * @returns {[String]} HTML разделенный на строки
 */
function splitData(el) {
  return el.split('\n')
}

/**
 * Извекает данные OG
 * @param {String} el - HTML строка
 * @returns {Object} - данные из HTML в удобном формате (свойство : значение)
 */
function createInfo(el) {
  return {
    property: getProperty(el),
    value: getContent(el)
  }
}

/**
 * фильтрует данные с OG
 * @param {[String]} el - массив HTML строк
 * @returns {Object} данные для подстановки в карточку .preview
 */
function createOG_object(el) {
  return el
    .filter(e => e.indexOf('og:') > -1) //оставляем строки, содержащие OG
    .map(e => e.replaceAll('\"', '')) //Убираем экранированные ковычки
    .map(createInfo)
}

/**
 * Подготавливает даннеы для записи в HTML теги
 * @param {Object} data - данные
 * @returns {Object} подготовленные данные
 */
function prepareData(data) {
  let output = {};
  output.title = data.find(e => e.property == 'title').value;
  output.description = data.find(e => e.property == 'description').value;
  let url = data.find(e => e.property == 'url').value.replace('index.html', '');
  let src = data.find(e => e.property == 'image').value.replace('./', '');
  output.src = url + src;
  return output;
}

/**
 * Возвращает название OG свойства
 * @param {String} str - HTML строка
 * @returns {String} - OG свойство
 */
function getProperty(str) {
  let search = 'og:';
  let start = str.indexOf(search);
  let end = str.indexOf(' ', start);
  return str.substring(start + search.length, end);
}

/**
 * Возвращает OG значение
 * @param {String} str - HTML строка
 * @returns {String} - OG значение
 */
function getContent(str) {
  let search = 'content=';
  let start = str.indexOf(search);
  let end = str.indexOf('>', start);
  return str.substring(start + search.length, end)
}


async function checkMedia() {
  if (!window.matchMedia('(any-hover: hover)').matches) return;
  let examples = document.querySelectorAll('.example')
  examples = Array.from(examples)
  let tmp = examples.map(checkStorage)
  let readyToAdd = [];
  let mustFetch = [];
  tmp.forEach(e => {
    (e.hasOwnProperty('src')) ? readyToAdd.push(e) : mustFetch.push(e)
  })
  if (mustFetch.length) {
    mustFetch = await Promise.all([...mustFetch].map(fetchData))
    mustFetch = mustFetch.map(splitData).map(createOG_object).map(prepareData)
    saveData(mustFetch)
    mustFetch.map(el => {
      el.target = examples.find(e => e.text == el.title)
    })
  }
  readyToAdd = [...readyToAdd, ...mustFetch]
  readyToAdd.forEach(addData)
}

/**
 * Сохранение данных в LocalStorage
 * @param {[String]} array - данные для сохранения
 */
function saveData(array) {
  array = array.map(el => {
    window.localStorage.setItem(el.title, el.description)
    window.localStorage.setItem(`${el.title}-src`, el.src)
  });
}

/**
 * Запись данных в карточку .preview
 * @param {Object} data - данные
 */
function addData(data) {
  let target = data.target.closest('.examples__item');
  let preview = target.querySelector('.empty')
  let title = target.querySelector('.preview_title');
  let description = target.querySelector('.preview_description');
  let img = target.querySelector('.preview_img');
  title.textContent = data.title;
  description.textContent = data.description;
  img.src = data.src;
  preview.classList.remove('empty')
}

/**
 * Проверка хранилища на запрашиваемые данные
 * @param {HTMLElement} target - элемент .preview, которому необходимо заполнить данные
 * @returns {HTMLElement | Object} если checkValue=true => вернет исходный элемент,
 *  в противном случае объект для заполнения
 */
function checkStorage(target) {
  let output = {}
  output.target = target;
  output.title = target.textContent;
  output.description = window.localStorage.getItem(target.textContent);
  output.src = window.localStorage.getItem(`${target.textContent}-src`)
  return (checkValue(output)) ? target : output
}

/**
 * Проверяет value на заполненность
 * @param {*} value 
 * @returns {Boolean} - true если value неопределено
 */
function checkValue(value) {
  return ((Object.values(value)).some(e => e == null || undefined))
}

document.addEventListener('DOMContentLoaded', checkMedia)