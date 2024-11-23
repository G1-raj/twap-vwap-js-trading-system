const formatDate = (dateString) => {

    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const [datePart] = dateString.split(' ');
    const [year, month, day] = dateString.split('-');

    const monthIndex = parseInt(month, 10) - 1;
    const dayNumber = parseInt(day, 10);

    if (isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) {
        throw new Error(`Invalid month value: ${month}`);
    }


    if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 31) {
        throw new Error(`Invalid day value: ${day}`);
    }

    return `${dayNumber}${months[monthIndex]}`;

}

export default formatDate;