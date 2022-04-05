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
