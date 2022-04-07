function toggleTheme() {
    let link = document.getElementsByTagName(link);
    let light = a.filter(e => e.href.indexOf('light') > -1)[0]
    let dark = a.filter(e => e.href.indexOf('dark') > -1)[0]




    //window.matchMedia('(prefers-color-scheme: dark)')
}


document.addEventListener('click', function (e) {
    let menu = document.querySelector('.menu');
    if (e.target.closest('.menu:not(.open)')) {
        menu.classList.add('open');
        document.body.style.overflow = 'hidden';
    } else if (e.target.closest('header')) {
        menu.classList.remove('open');
        document.body.style.overflow = 'auto';
    }
})
