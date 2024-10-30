const scrolling = (upSelector = false) => {
    const element = document.documentElement,
          body = document.body,
          upElem = document.querySelector(upSelector);
    let links = document.querySelectorAll('[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            let hash = this.hash;
            if (hash == '') return;

            doScrolling(this, hash);
        });
    });

    const doScrolling = (event, elementSelector, statelocation = false, duration = false) => {
        let startingY = window.scrollY,
            elementS = document.querySelector(elementSelector),
            elementY = startingY + elementS.getBoundingClientRect().top,
            scrollHeight = Math.round(element.scrollHeight || body.scrollHeight),
            targetY = scrollHeight - elementY < window.innerHeight ? scrollHeight - window.innerHeight : elementY,
            difference = targetY - startingY,
            start = null;

        // Easing function: easeInOutCubic
        // From: https://gist.github.com/gre/1650294
        let easing = (t) => { return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1 };

        if (!difference) return;

        requestAnimationFrame(step);

        function step(time) {
            if (!duration) duration = 1500;
            if (start === null) start = time;
            let progress = time - start,
                percent = easing(Math.min(progress / duration, 1)),
                scrollPx = startingY + difference * percent;

            window.scrollTo(0, scrollPx);

            if (progress < duration) {
                requestAnimationFrame(step);
            } else {
                if (statelocation && !event.hasAttribute('data-no-hash')) {
                    // location.hash = elementSelector;
                }
            }
        }

    };


}

export default scrolling;