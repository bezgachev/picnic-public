function timer(id, deadline, timerCompleted, deletingSelector) {
    function getTimeRemaining(endtime) {
        let days, hours, minutes, seconds;
        const t = Date.parse(endtime) - Date.parse(new Date());

        if (t <= 0) {
            days = hours = minutes = seconds = 0;
            
        } else {
            days = Math.floor(t / (1000 * 60 * 60 * 24) );
            hours = Math.floor((t / (1000 * 60 * 60) % 24));
            minutes = Math.floor((t / 1000 / 60) % 60);
            seconds = Math.floor((t / 1000) % 60);
        }

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function setClock(selector, endtime, deletingSelector) {
        const timer = document.querySelector(selector),
            timeInterval = setInterval(updateClock, 1000);
        
        const nameClockDays = ['дней', 'день', 'дня'],
            nameClockHours = ['часов', 'час', 'часа'],
            nameClockMinutes = ['минут', 'минута', 'минуты'],
            nameClockSeconds = ['секунд', 'секунда', 'секунды'];

        updateClock();

        function updateClock() {
            const t = getTimeRemaining(endtime);
            timer.textContent = `
                ${
                    (t.days == 0 && t.hours !== 0) ?
                        t.hours + ' ' + updateNameClock(t.hours, nameClockHours) + ' ' + 
                        t.minutes + ' ' + updateNameClock(t.minutes, nameClockMinutes) +' '
                    : 

                    (t.days == 0 && t.hours == 0) ?
                        t.minutes + ' ' + updateNameClock(t.minutes, nameClockMinutes) + ' ' + 
                        t.seconds + ' ' + updateNameClock(t.seconds, nameClockSeconds) +' '
                    : 

                    (t.days != 0 && t.hours == 0 && t.minutes != 0) ?
                        t.days + ' ' + updateNameClock(t.days, nameClockDays) + ' ' + 
                        t.minutes + ' ' + updateNameClock(t.minutes, nameClockMinutes) 
                    :
                        t.days + ' ' + updateNameClock(t.days, nameClockDays) + ' ' + 
                        t.hours + ' ' + updateNameClock(t.hours, nameClockHours) + ' ' + 
                        t.minutes + ' ' + updateNameClock(t.minutes, nameClockMinutes) 
                }
            `;

            if (t.total <= 0) {
                timerCompleted = 'true';
                timer.parentNode.remove();
            } else {
                timerCompleted = timerCompleted;
            }
        }

        function updateNameClock(quantity, ClockArr) {
            if(((quantity >= 5) && (quantity <= 19)) || ((quantity == 0) || (quantity%10 >= 5) || (quantity%10 == 0))) {
                return ClockArr[0];
            } else {
                if ((quantity == 1) || (quantity%10 == 1)) {
                    return ClockArr[1];
                }
                else {
                    return ClockArr[2];
                }
            }
        }

    }
    
    setClock(id, deadline, timerCompleted, deletingSelector);
    return timerCompleted;
}

export default timer;