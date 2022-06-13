import test from 'ava'

import RecaptchaPlugin from '../src'

import { addExtra } from 'puppeteer-extra'

const PUPPETEER_ARGS = ['--no-sandbox', '--disable-setuid-sandbox']

test.serial('will detect reCAPTCHAs', async (t) => {
  const puppeteer = addExtra(require('puppeteer'))
  const recaptchaPlugin = RecaptchaPlugin()
  puppeteer.use(recaptchaPlugin)

  const browser = await puppeteer.launch({
    args: PUPPETEER_ARGS,
    headless: true,
  })
  const page = await browser.newPage()

  const url = 'https://www.google.com/recaptcha/api2/demo'
  await page.goto(url, { waitUntil: 'networkidle0' })

  const { captchas, error } = await (page as any).findRecaptchas()
  t.is(error, null)
  t.is(captchas.length, 1)

  const c = captchas[0]
  t.is(c._vendor, 'recaptcha')
  t.is(c.callback, 'onSuccess')
  t.is(c.hasResponseElement, true)
  t.is(c.url, url)
  t.true(c.sitekey && c.sitekey.length > 5)

  await browser.close()
})

test.serial('will detect hCAPTCHAs', async (t) => {
  const puppeteer = addExtra(require('puppeteer'))
  const recaptchaPlugin = RecaptchaPlugin()
  puppeteer.use(recaptchaPlugin)

  const browser = await puppeteer.launch({
    args: PUPPETEER_ARGS,
    headless: true,
  })
  const page = await browser.newPage()

  const url = 'https://democaptcha.com/demo-form-eng/hcaptcha.html'
  await page.goto(url, { waitUntil: 'networkidle0' })

  const { captchas, error } = await (page as any).findRecaptchas()
  t.is(error, null)
  t.is(captchas.length, 1)

  const c = captchas[0]
  t.is(c._vendor, 'hcaptcha')
  t.is(c.url, url)
  t.true(c.sitekey && c.sitekey.length > 5)

  await browser.close()
})

test.serial('will not throw when no captchas are found', async (t) => {
  const puppeteer = addExtra(require('puppeteer'))
  const recaptchaPlugin = RecaptchaPlugin()
  puppeteer.use(recaptchaPlugin)

  const browser = await puppeteer.launch({
    args: PUPPETEER_ARGS,
    headless: true,
  })
  const page = await browser.newPage()

  const url = 'https://www.example.com'
  await page.goto(url, { waitUntil: 'networkidle0' })

  const { captchas, error } = await (page as any).findRecaptchas()
  t.is(error, null)
  t.is(captchas.length, 0)

  await browser.close()
})

// TODO: test/mock the rest
