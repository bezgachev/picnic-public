import form from './modules/form';
import timer from "./modules/timer";
import scrolling from "./modules/scrolling";
import maps from "./modules/maps";
import video from './modules/video';

document.addEventListener('DOMContentLoaded', function() {
    "use strict";
    
    let deadline = '2024-11-31 15:00';
    let timerCompleted = timer('#timer', deadline, 'false', 'register__wrapper');

    form('.data-basic', '.data-other', timerCompleted, '4100117640768412');
    scrolling();
    maps([55.866308, 48.782320]);
    video('.video__section', 'xYKmR7quvH8');

    let developer = document.createElement('div');
    developer.className = 'footer__development';
    developer.innerHTML = '<a href="https://github.com/bezgachev" target="_blank">Разработка сайтов и интернет-магазинов</a>';
    document.querySelector('footer').insertAdjacentElement('beforeend', developer);
});