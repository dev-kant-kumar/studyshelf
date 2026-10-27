import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import {
  holidays2026,
  holidaySummary,
  getHolidayStatus,
  getNextUpcomingHoliday,
} from '../src/app/main-website/pages/Holidays/holidayData.js'

test('holidays list contains all 39 university-notified entries matching official circular', () => {
  assert.equal(holidays2026.length, 39)

  // Verify sequential serial numbers 1 to 39
  holidays2026.forEach((holiday, index) => {
    assert.equal(holiday.slNo, index + 1)
    assert.ok(holiday.name, `Holiday #${index + 1} missing name`)
    assert.ok(holiday.hindiName, `Holiday #${index + 1} missing hindiName`)
    assert.ok(holiday.date, `Holiday #${index + 1} missing date`)
    assert.ok(holiday.startDate, `Holiday #${index + 1} missing startDate`)
    assert.ok(holiday.endDate, `Holiday #${index + 1} missing endDate`)
    assert.ok(holiday.startDate <= holiday.endDate, `Invalid date range for #${holiday.slNo}`)
    assert.ok(holiday.days >= 1, `Invalid day count for #${holiday.slNo}`)
  })
})

test('aggregate totals match official VBU 2026 circular: 85 days, 10 sundays, 75 working days off', () => {
  const totalDays = holidays2026.reduce((sum, h) => sum + h.days, 0)
  const totalSundays = holidays2026.reduce((sum, h) => sum + h.sundays, 0)

  assert.equal(totalDays, 85)
  assert.equal(totalSundays, 10)
  assert.equal(totalDays - totalSundays, 75)
  assert.equal(holidaySummary.totalDays, 85)
  assert.equal(holidaySummary.sundays, 10)
  assert.equal(holidaySummary.workingDaysOff, 75)
})

test('four major academic vacations are properly configured', () => {
  const summer = holidays2026.find(h => h.id === 'summer-vacation')
  assert.ok(summer)
  assert.equal(summer.days, 20)
  assert.equal(summer.sundays, 2)

  const dussehra = holidays2026.find(h => h.id === 'dussehra-vacation')
  assert.ok(dussehra)
  assert.equal(dussehra.days, 6)
  assert.equal(dussehra.sundays, 1)

  const autumn = holidays2026.find(h => h.id === 'autumn-vacation')
  assert.ok(autumn)
  assert.equal(autumn.days, 12)
  assert.equal(autumn.sundays, 2)

  const winter = holidays2026.find(h => h.id === 'winter-vacation')
  assert.ok(winter)
  assert.equal(winter.days, 7)
  assert.equal(winter.sundays, 1)
})

test('holiday status and upcoming helper correctly classify dates', () => {
  // During Summer Vacation (e.g. 5 June 2026)
  const summer = holidays2026.find(h => h.id === 'summer-vacation')
  assert.equal(getHolidayStatus(summer, '2026-06-05'), 'active')
  assert.equal(getHolidayStatus(summer, '2026-05-30'), 'upcoming')
  assert.equal(getHolidayStatus(summer, '2026-06-25'), 'past')

  // Next upcoming holiday for 27 October 2026
  const next = getNextUpcomingHoliday('2026-10-27')
  assert.ok(next)
  assert.equal(next.status, 'upcoming')
  assert.equal(next.holiday.id, 'autumn-vacation')
})

test('official circular notice image files exist in public folder', () => {
  for (const notice of holidaySummary.sourceNotices) {
    const filePath = path.resolve('public', notice.href.replace(/^\//, ''))
    assert.ok(fs.existsSync(filePath), `Notice file missing: ${filePath}`)
  }
})
