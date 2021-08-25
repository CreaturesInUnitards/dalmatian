/* dalmatian/index.mjs */
export default (() => {
    const DAYS_IN_WEEK = 7
    const MONTHS_IN_YEAR = 12

    const finalDateInMonth = (month, year) =>
        month === 1 && (!(year % 4) && ((year % 100) || !(year % 400)))
            ? 29
            : month === 1
            ? 28
            : [3, 5, 8, 10].includes(month)
            ? 30
            : 31

    return ({
        locale = navigator.languages[0],
        week_start = 0,
        weekday = 'long',
        month = 'long'
    } = {}) => {
        // 1/1/2017 was month:0 and weekday:0, so perfect
        const date = new Date('jan 1 2017')

        let days = []
        while (days.length < DAYS_IN_WEEK) {
            days.push(date.toLocaleDateString(locale, {weekday}))
            date.setDate(date.getDate() + 1)
        }
        days = days
            .slice(week_start)
            .concat(days.slice(0, week_start))

        const months = []
        while (months.length < MONTHS_IN_YEAR) {
            months.push(date.toLocaleDateString(locale, {month}))
            date.setMonth(date.getMonth() + 1)
        }

        const monthMap = (_date = new Date()) => {
            const this_month = new Date(_date)
            this_month.setDate(1)

            const starting_offset = (this_month.getDay() - week_start + DAYS_IN_WEEK) % DAYS_IN_WEEK

            const daysForMonth = (index, month_offset) => {
                const _date = new Date(this_month)
                month_offset && _date.setMonth(_date.getMonth() + month_offset)
                _date.setDate(month_offset === -1
                    ? finalDateInMonth(_date.getMonth(), _date.getFullYear()) - starting_offset + index + 1
                    : index + 1
                )
                return _date
            }

            const days_from_prev = [...Array(starting_offset)]
                .map((_, i) => daysForMonth(i, -1))
            const days_from_current = [...Array(finalDateInMonth(_date.getMonth(), this_month.getFullYear()))]
                .map((_, i) => daysForMonth(i))

            const last_day = [...days_from_current].pop().getDay()
            const ending_offset = (DAYS_IN_WEEK + week_start - last_day - 1) % DAYS_IN_WEEK
            const days_from_next = [...Array(ending_offset)]
                .map((_, i) => daysForMonth(i, 1))
            return [...days_from_prev, ...days_from_current, ...days_from_next]
        }

        return {
            days,
            months,
            monthMap,
        }
    }
})()