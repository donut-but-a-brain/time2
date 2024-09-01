function getWinterSolstice(year) {
    // Approximation of the Winter Solstice date (December 21)
    const solstice = new Date(Date.UTC(year, 11, 21));
    return solstice;
}

function convertToCustomTime(date) {
    const year = date.getUTCFullYear();
    const winterSolstice = getWinterSolstice(year);
    
    // Calculate the number of days since the Winter Solstice
    const dayOfYearFromSolstice = Math.floor((date - winterSolstice) / (1000 * 60 * 60 * 24));
    const adjustedDayOfYear = dayOfYearFromSolstice < 0 ? dayOfYearFromSolstice + 365 : dayOfYearFromSolstice;

    // Custom time constants
    const customSecondsPerSecond = 0.9;
    const secondsInMinute = 100;
    const minutesInHour = 100;
    const hoursInDay = 10;
    const daysInWeek = 10;
    const weeksInMonth = 3.6; // 36 days per month
    const monthsInYear = 10;
    const bonusDays = 5;
    const daysInYear = monthsInYear * weeksInMonth * daysInWeek + bonusDays;

    // Calculate total custom seconds since the Winter Solstice
    const utcMillisecondsFromSolstice = date - winterSolstice;
    const customTotalSeconds = utcMillisecondsFromSolstice / 1000 * customSecondsPerSecond;

    // Calculate custom time components
    const customTotalDays = customTotalSeconds / (secondsInMinute * minutesInHour * hoursInDay);
    const dayOfYear = adjustedDayOfYear + customTotalDays;
    
    const customYear = dayOfYear >= 0 ? year : year - 1;
    const customDayOfYear = dayOfYear >= 0 ? dayOfYear : daysInYear + dayOfYear;

    const month = Math.floor(customDayOfYear / (weeksInMonth * daysInWeek)) + 1;
    const dayOfMonth = Math.floor(customDayOfYear % (weeksInMonth * daysInWeek)) + 1;

    const hour = Math.floor((customTotalSeconds % (secondsInMinute * minutesInHour * hoursInDay)) / (secondsInMinute * minutesInHour));
    const minute = Math.floor((customTotalSeconds % (secondsInMinute * minutesInHour)) / secondsInMinute);
    const second = Math.floor(customTotalSeconds % secondsInMinute);

    return {
        year: customYear,
        month: month,
        day: dayOfMonth,
        hour: hour,
        minute: minute,
        second: second,
    };
}

function updateClocks() {
    const now = new Date();
    const customTime = convertToCustomTime(now);

    // Update digital clock
    const digitalClock = document.getElementById('digitalClock');
    digitalClock.textContent = `Year ${customTime.year}, Month ${customTime.month}, Day ${customTime.day}, ${customTime.hour}:${customTime.minute}:${customTime.second}`;

    // Update analogue clock hands
    const secondHand = document.getElementById('secondHand');
    const minuteHand = document.getElementById('minuteHand');
    const hourHand = document.getElementById('hourHand');

    secondHand.style.transform = `rotate(${(customTime.second / 100) * 360}deg)`;
    minuteHand.style.transform = `rotate(${(customTime.minute / 100) * 360}deg)`;
    hourHand.style.transform = `rotate(${(customTime.hour / 10) * 360}deg)`;
}

// Initialize clock and update every second
setInterval(updateClocks, 1000);
