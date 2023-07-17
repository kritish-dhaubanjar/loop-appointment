export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

export const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function generateCalendar({ month, year }) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  const calendar = []

  let index = firstDay.getDay()
  let week = new Array(index).fill(null)

  for (let day = 1; day <= lastDay.getDate(); day++) {
    week[index++] = day

    if (week.length === 7) {
      calendar.push(week)
      week = []
      index = 0
    }
  }

  if (week.length) {
    for (let day = week.length; day < 7; day++) {
      week.push(null)
    }

    calendar.push(week)
  }

  return calendar
}
