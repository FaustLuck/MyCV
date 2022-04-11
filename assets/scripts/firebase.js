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
const database = getDatabase(app)
const errors = {
  empty: {
    ru: 'Заполнены не все поля!',
    en: 'Not all fields are filled!'
  },
  email: {
    ru: 'Не валидный адрес электронной почты',
    en: 'Not a valid email address!'
  }
}
/**
 * Отправка данных в firebase-database
 * @param {Object} e - событие отправки формы
 * @param {Number} e.id - ID сообщения (строка с датой отправки)
 * @param {Object} e.data - данные сообщения
 */
function setData(e) {
  let id = createIDmsg()
  let data = createData(e)
  if (typeof (data) == 'string') return alert(data)
  const db = getDatabase();
  set(ref(db, id), data);
}

/**
 * создание объекта для сохранения сообщения
 * @param {Object} e - событие отправки формы
 * @returns {Object} - объект для записи в БД
 */
function createData(e) {
  let form = document.forms[0]
  let lang = document.documentElement.lang;
  if (form.bucket.value) return
  if (e.target != form.send) return
  if ([form.name.value, form.email.value, form.message.value].some(e => e == '')) return errors.empty[lang];
  if (!validateEmail(form.email.value)) return errors.email[lang]
  return {
    name: form.name.value,
    email: form.email.value,
    message: form.message.value
  }
}
document.documentElement.lang
/**
 * Проверка адреса эл. почты
 * @param {String} email - адрес электронной почты
 * @returns {Boolean} true если проверка пройдена
 */
function validateEmail(email) {
  let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  return email.match(regex)[0]
}

/**
 * Создание ID сообщения на основании времени отправки
 * @returns {String} - строка с датой отправки
 */
function createIDmsg() {
  let date = new Date();
  return `${date.getDate()}-${date.getMonth()}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

document.querySelector('.submit').addEventListener('click', setData)
