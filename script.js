function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function unixToCustomTime() {
    const now = new Date();
    const year = now.getFullYear() + 10000;
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    
    let totalDaysInYear = isLeapYear(year - 10000) ? 366 : 365;
    let month, day, dayOutOfMonth = false;

    if (dayOfYear <= 360) {
        month = Math.floor((dayOfYear - 1) / 36) + 1;
        day = (dayOfYear - 1) % 36 + 1;
    } else {
        month = 0;
        day = dayOfYear - 360;
        dayOutOfMonth = true;
    }

    const totalSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    const customHour = totalSeconds / 8640;
    const customMinute = (totalSeconds % 8640) / 86.4;
    const customSecond = (totalSeconds % 86.4) / 0.864;

    const monthNames = ["Premaber", "Duember", "Trimber", "Quadober", "Quintumber", "Sextamber", "September", "Octimber", "Novomber", "Decumber"];
    let customDate = dayOutOfMonth ? `Day ${day}, ${year}` : `${monthNames[month-1]} ${day}, ${year}`;
    let customTime = `${Math.floor(customHour).toString().padStart(2, '0')}:${Math.floor(customMinute).toString().padStart(2, '0')}:${Math.floor(customSecond).toString().padStart(2, '0')}`;

    return { customDate, customTime, customHour, customMinute, customSecond };
}

function drawClock() {
    const canvas = document.getElementById('clock');
    const ctx = canvas.getContext('2d');
    const center = 200;
    const radius = 180;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw clock face
    for (let i = 0; i < 10; i++) {
        let angle = (i * 36) * Math.PI / 180;
        let x = center + radius * Math.sin(angle);
        let y = center - radius * Math.cos(angle);
        ctx.fillStyle = 'white';
        ctx.font = '22px Arial';
        ctx.fillText(i.toString(), x - 10, y + 10);
    }

    for (let i = 0; i < 100; i++) {
        let angle = (i * 3.6) * Math.PI / 180;
        let xStart = center + (radius - 10) * Math.sin(angle);
        let yStart = center - (radius - 10) * Math.cos(angle);
        let xEnd = center + radius * Math.sin(angle);
        let yEnd = center - radius * Math.cos(angle);
        ctx.strokeStyle = 'white';
        ctx.beginPath();
        ctx.moveTo(xStart, yStart);
        ctx.lineTo(xEnd, yEnd);
        ctx.stroke();
    }
}

function drawClockHands(customHour, customMinute, customSecond) {
    const canvas = document.getElementById('clock');
    const ctx = canvas.getContext('2d');
    const center = 200;
    const radius = 180;

    // Draw hour hand
    let hourAngle = (customHour / 10 * 360) - 90;
    drawHand(ctx, center, radius * 0.5, hourAngle, 'red');

    // Draw minute hand
    let minuteAngle = (customMinute / 100 * 360) - 90;
    drawHand(ctx, center, radius * 0.75, minuteAngle, 'blue');

    // Draw second hand
    let secondAngle = (customSecond / 100 * 360) - 90;
    drawHand(ctx, center, radius * 0.9, secondAngle, 'green');
}

function drawHand(ctx, center, length, angleDegrees, color) {
    let angle = angleDegrees * Math.PI / 180;
    let xEnd = center + length * Math.cos(angle);
    let yEnd = center + length * Math.sin(angle);

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.lineTo(xEnd, yEnd);
    ctx.stroke();
}

function updateClock() {
    const { customDate, customTime, customHour, customMinute, customSecond } = unixToCustomTime();
    document.getElementById('date').textContent = customDate;
    document.getElementById('time').textContent = customTime;
    drawClock();
    drawClockHands(customHour, customMinute, customSecond);
    setTimeout(updateClock, 1000);
}

updateClock();
