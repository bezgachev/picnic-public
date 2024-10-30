const video = (selector, id) => {
    const btn = document.querySelector(selector);

    const createPlayer = (e, id) => {
        e.player = new YT.Player('iframe', {
            height: '100%',
            width: '100%',
            playerVars: { 'autoplay': 1, 'controls': 0, 'suggestedQuality': 'hd1080', 'fs': 1, 'showinfo': 0, 'rel': 0, 'color': 'white', 'playsinline': 0, 'modestbranding': 1, 'iv_load_policy': 3, 'enablejsapi': 1},
            videoId: `${id}`
        });
    }

    const bindTriggers = () => {
        btn.addEventListener('click', (e) => {
            if (e.target.querySelector('iframe')) {
            } else {
                btn.removeAttribute('style');
                btn.querySelector('div').removeAttribute('style');
                createPlayer(e.target, id);

            }
        });
    }

    if (btn) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        btn.style.cssText = `
            background: url('//img.youtube.com/vi/${id}/sddefault.jpg') center no-repeat;
            background-size: cover;
            cursor: pointer;
            position: relative;
        `;
        btn.querySelector('div').style.cssText = `
            background: url("data:image/svg+xml;charset=UTF-8,%3csvg width='40' height='40' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cg clip-path='url(%23clip0_125_16)'%3e%3cellipse cx='29.7' cy='29.8218' rx='29.7' ry='29.8218' fill='%23FCB671'/%3e%3cpath d='M38.8123 28.4238C39.477 28.8091 39.477 29.7687 38.8123 30.154L26.691 37.181C26.0244 37.5674 25.1895 37.0864 25.1895 36.3158L25.1895 22.262C25.1895 21.4914 26.0244 21.0104 26.691 21.3968L38.8123 28.4238Z' fill='white'/%3e%3c/g%3e%3cdefs%3e%3cclipPath id='clip0_125_16'%3e%3crect width='60' height='60' fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e") center no-repeat;
            z-index: 999;
            width: 40px;
            height: 40px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            position: absolute;
        `;

        bindTriggers();
    }
        
}

export default video;