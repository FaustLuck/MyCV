function toggleTheme(e) {
  if (!e.target.closest('.theme')) return;
  let isDark = window.localStorage.getItem('dark')
  isDark = (isDark == 'true') ? false : true;
  window.localStorage.setItem('dark', isDark)
  document.body.classList.toggle('dark')
  document.body.classList.toggle('light')
  toggleIcon()
}

function toggleMenu(e) {
  if (window.matchMedia('(min-width: 768px)').matches) return;
  if (!e.target.closest('.menu')) return
  let menu = document.querySelector('.menu');
  menu.classList.toggle('open');
  let flag = Array.from(menu.classList).includes('open');
  document.body.style.overflow = (flag) ? 'hidden' : 'auto'
}

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

function toggleIcon() {
  let icons = document.querySelectorAll('.icon');
  icons = Array.from(icons);
  icons = icons.map(toggleSrc)
}

function toggleSrc(el) {
  let sep = (window.localStorage.getItem('dark') == 'true') ? 'dark' : 'light'
  let tmp = el.src.split(sep)
  tmp = tmp.join(sep)
  el.src = tmp
  return el
}


document.addEventListener('click', toggleMenu)
document.addEventListener('click', toggleTheme)
document.addEventListener('DOMContentLoaded', checkTheme)