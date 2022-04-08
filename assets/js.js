function toggleTheme(e) {
  if (!e.target.closest('.theme')) return;
  let flag = window.localStorage.getItem('dark')
  window.localStorage.setItem('dark', !flag)
  console.log(window.localStorage.getItem('dark'))
  document.body.classList.toggle('dark')
  document.body.classList.toggle('light')
}

function toggleMenu(e) {
  if (window.matchMedia('(min-width: 768px)').matches) return;
  if (!e.target.closest('.menu')) return
  let menu = document.querySelector('.menu');
  menu.classList.toggle('open');
  let flag = Array.from(menu.classList).includes('open');
  document.body.style.overflow = (flag) ? 'hidden' : 'auto'
}

document.addEventListener('click', toggleMenu)
document.addEventListener('click', toggleTheme)

if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  window.localStorage.setItem('dark', true)
  document.body.classList.add('dark')
} else {
  window.localStorage.setItem('dark', false)
  document.body.classList.add('light')
}

function toggleIcons() {
  document.querySelector
}