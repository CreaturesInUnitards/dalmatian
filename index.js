/* dalmatian/index.js */
export default (() => {
  const DAYS_IN_WEEK = 7
  const MONTHS_IN_YEAR = 12

  const finalDateInMonth = (month, year) => 
    month === 1 && (!(year % 4) && ((year % 100) || !(year % 400)))
      ? 29
      : month === 1
      ? 28
      : [3,5,8,10].includes(month)
      ? 30
      : 31

 return   ({
    locale = 'en-us', 
    week_start = 0,
    weekday = 'long', 
    month = 'long'
  } = {}) => {
    const stringsForLocale = () => {
      // 1/1/2017 was month:0 and weekday:0, so perfect
      const date = new Date('jan 1 2017')
      const months = []
      const _days = [] 

      while (_days.length < DAYS_IN_WEEK) {
        _days.push(date.toLocaleDateString(locale, { weekday }))
        date.setDate(date.getDate() + 1)
      }

      while (months.length < MONTHS_IN_YEAR) {
        months.push(date.toLocaleDateString(locale, { month }))
        date.setMonth(date.getMonth() + 1)
      }
      return { 
        months,
        days: _days
          .slice(week_start)
          .concat(_days.slice(0, week_start))
      }
    }

    const monthMap = (_date = new Date()) => {
      const this_month = new Date(_date)
      this_month.setDate(1)

      const starting_offset = (this_month.getDay() - week_start + DAYS_IN_WEEK) % DAYS_IN_WEEK

      const days_from_prev = [...Array(starting_offset)]
        .map((_, i) => {
          const prev = new Date(this_month)
          prev.setMonth(prev.getMonth() - 1)
          prev.setDate(finalDateInMonth(prev.getMonth(), prev.getFullYear()) - starting_offset + i + 1)
          return prev
        })
      const days_from_current = [...Array(finalDateInMonth(_date.getMonth(), this_month.getFullYear()))]
        .map((_, i) => {
          const current = new Date(this_month)
          current.setDate(i + 1)
          return current
        })

      const last_day = [...days_from_current].pop().getDay()
      const ending_offset = (DAYS_IN_WEEK + week_start - last_day - 1) % DAYS_IN_WEEK
      const days_from_next = [...Array(ending_offset)]
        .map((_, i) => {
          const next = new Date(this_month)
          next.setMonth(next.getMonth() + 1, i + 1)
          return next
        })
      return [...days_from_prev, ...days_from_current, ...days_from_next]
    }

    const { days, months } = stringsForLocale()

    return {
      days,
      months,
      monthMap,
    }
  }
})()