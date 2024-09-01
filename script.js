function convertToCustomTime(date) {
    const utcMilliseconds = date.getTime();

    // Custom time constants
    const customSecondsPerSecond = 0.9; // 0.9 custom seconds per real second
    const secondsInMinute = 100;
    const minutesInHour = 100;
    const hoursInDay = 10;
    const daysInWeek = 10;
    const weeksInMonth = 3.6; // 36 days per month
    const monthsInYear = 10;
    const bonusDays = 5;
    const daysInYear = monthsInYear * weeksInMonth * daysInWeek + bonusDays; // 365 days

    // Calculate total custom seconds since UNIX epoch (UTC)
    const customTotalSeconds = utcMilliseconds / 1000 * customSecondsPerSecond;

    // Calculate custom time components
    const customTotalDays = customTotalSeconds / (secondsInMinute * minutesInHour * hoursInDay);
    const year = Math.floor(customTotalDays / daysInYear) + 1970; // Start from the year 1970
    const dayOfYear = customTotalDays % daysInYear;

    const month = Math.floor(dayOfYear / (weeksInMonth * daysInWeek)) + 1;
    const dayOfMonth = Math.floor(dayOfYear % (weeksInMonth * daysInWeek)) + 1;

    const hour = Math.floor((customTotalSeconds % (secondsInMinute * minutesInHour * hoursInDay)) / (secondsInMinute * minutesInHour));
    const minute = Math.floor((customTotalSeconds % (secondsInMinute * minutesInHour)) / secondsInMinute);
    const second = Math.floor(customTotalSeconds % secondsInMinute);

    return {
        year: year,
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
