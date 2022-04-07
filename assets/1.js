var themeLink = 'https://webdevtips.ru/wp-content/themes/New/css/dark.css';
function applyTheme() {
  let isDarkTheme = localStorage.getItem('isDarkTheme');
  if (isDarkTheme == 'true') {
    document.getElementById('darkTheme').style.display = 'none'; document.getElementById('lightTheme').style.display = 'block'; document.querySelector("link[title=theme]").href = themeLink;
  }
  if (isDarkTheme == 'false' || isDarkTheme == null) {
    document.getElementById('darkTheme').style.display = 'block';
    document.getElementById('lightTheme').style.display = 'none';
     document.querySelector('link[title="theme"]').href = '';
  }
}
applyTheme(); 
document.getElementById('darkTheme').addEventListener('click', function () { setTheme('dark'); }); document.getElementById('lightTheme').addEventListener('click', function () { setTheme('light'); }); function setTheme(theme) {
  if (theme == 'dark') { localStorage.setItem('isDarkTheme', true) }
  if (theme == 'light') { localStorage.setItem('isDarkTheme', false) }
  applyTheme();
};
