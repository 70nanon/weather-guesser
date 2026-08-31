import { describe, expect, it } from 'vitest'
import type { DailyWeather, Guess } from '../types/weather'
import { calculateScore } from './calculateScore'
import { calculateAbsurdity } from './calculateAbsurdity'

// weather_code 0 = 晴れ
const tomorrowClear: DailyWeather = {
  weatherCode: 0,
  tempMax: 20,
  tempMin: 10,
  precipProbMax: 10,
}

describe('calculateScore', () => {
  it('完全一致なら満点(100点)', () => {
    const guess: Guess = {
      weather: 'clear',
      tempMax: 20,
      tempMin: 10,
      precipProb: 10,
    }
    const s = calculateScore(guess, tomorrowClear)
    expect(s).toEqual({
      tempMax: 30,
      tempMin: 30,
      weather: 25,
      precip: 15,
      total: 100,
    })
  })

  it('気温が10℃以上ずれると気温点は0になる', () => {
    const guess: Guess = {
      weather: 'clear',
      tempMax: 35,
      tempMin: 25,
      precipProb: 10,
    }
    const s = calculateScore(guess, tomorrowClear)
    expect(s.tempMax).toBe(0)
    expect(s.tempMin).toBe(0)
    expect(s.weather).toBe(25)
  })

  it('晴れ予想で実際が曇りなら天気は部分点', () => {
    const cloudyTomorrow: DailyWeather = { ...tomorrowClear, weatherCode: 3 }
    const guess: Guess = {
      weather: 'clear',
      tempMax: 20,
      tempMin: 10,
      precipProb: 10,
    }
    const s = calculateScore(guess, cloudyTomorrow)
    expect(s.weather).toBeGreaterThan(0)
    expect(s.weather).toBeLessThan(25)
  })

  it('降水確率の差で減点される', () => {
    const guess: Guess = {
      weather: 'clear',
      tempMax: 20,
      tempMin: 10,
      precipProb: 60,
    }
    const s = calculateScore(guess, tomorrowClear)
    // 差50 → 15 * (1 - 0.5) = 7.5 → 8
    expect(s.precip).toBe(8)
  })
})

describe('calculateAbsurdity', () => {
  const today: DailyWeather = {
    weatherCode: 0,
    tempMax: 20,
    tempMin: 10,
    precipProbMax: 10,
  }

  it('普通の予想はありえなさ0', () => {
    const guess: Guess = {
      weather: 'clear',
      tempMax: 21,
      tempMin: 11,
      precipProb: 10,
    }
    expect(calculateAbsurdity(guess, today).score).toBe(0)
  })

  it('最低気温>最高気温は加点', () => {
    const guess: Guess = {
      weather: 'clear',
      tempMax: 10,
      tempMin: 20,
      precipProb: 10,
    }
    const r = calculateAbsurdity(guess, today)
    expect(r.score).toBeGreaterThanOrEqual(40)
    expect(r.reasons.length).toBeGreaterThan(0)
  })

  it('雪なのに猛暑は大きく加点', () => {
    const guess: Guess = {
      weather: 'snow',
      tempMax: 40,
      tempMin: 10,
      precipProb: 10,
    }
    const r = calculateAbsurdity(guess, today)
    // 雪+猛暑(50) と 今日からの急変(20℃, +30) が加点される
    expect(r.score).toBeGreaterThanOrEqual(50)
  })
})
