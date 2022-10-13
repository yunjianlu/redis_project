const getYearMonthDay = () => {
    const date = new Date();

    const year = date.getUTCFullYear();

    //return months 0 - 11, so we add 1
    const utcMonth = date.getUTCMonth() + 1;
    const month = utcMonth < 10 ? '0' + utcMonth : utcMonth;

    const day = date.getUTCFullDate();

    return `${year}-${month}-${day}`;
};

module.exports = {
    getYearMonthDay,
};
