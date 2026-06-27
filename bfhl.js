"use strict"

/**
 * Core processing logic for the Chitkara "Full Stack Test" (POST /bfhl).
 *
 * Given an array of mixed tokens, the endpoint must return:
 *   - odd_numbers / even_numbers      (numbers kept as STRINGS)
 *   - alphabets                       (alphabetic tokens, UPPERCASED)
 *   - special_characters              (anything that is neither numeric nor alphabetic)
 *   - sum                             (sum of all numbers, returned as a STRING)
 *   - concat_string                   (all alphabetical characters across the input,
 *                                       reversed, in alternating caps)
 */

// Identity used to build user_id and the static response fields.
const USER = {
  fullName: "Vipin Sohal",
  dob: "11112004", // ddmmyyyy
  email: "vipin1589.be23@chitkarauniversity.edu.in",
  rollNumber: "2311981589",
}

// user_id = {full_name_ddmmyyyy} in lowercase, spaces -> underscores
function buildUserId() {
  const name = USER.fullName.trim().toLowerCase().replace(/\s+/g, "_")
  return `${name}_${USER.dob}`
}

const isPureNumber = (token) => typeof token === "string" && /^[+-]?\d+$/.test(token.trim())
const isPureAlpha = (token) => typeof token === "string" && /^[a-zA-Z]+$/.test(token)

/**
 * Builds concat_string: collect every alphabetic CHARACTER from the input
 * (in order), reverse the full sequence, then apply alternating caps
 * (UPPER, lower, UPPER, ...).
 */
function buildConcatString(data) {
  const chars = []
  for (const token of data) {
    if (typeof token !== "string") continue
    for (const ch of token) {
      if (/[a-zA-Z]/.test(ch)) chars.push(ch)
    }
  }
  const reversed = chars.reverse()
  return reversed
    .map((ch, i) => (i % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()))
    .join("")
}

/**
 * Process the request body and return the BFHL response object.
 * Throws if `data` is missing or not an array.
 */
function processBfhl(body) {
  if (!body || !Array.isArray(body.data)) {
    const err = new Error("Request body must include a `data` array.")
    err.statusCode = 400
    throw err
  }

  const data = body.data

  const odd_numbers = []
  const even_numbers = []
  const alphabets = []
  const special_characters = []
  let sum = 0

  for (const raw of data) {
    const token = raw == null ? "" : String(raw)

    if (isPureNumber(token)) {
      const n = parseInt(token, 10)
      sum += n
      if (Math.abs(n) % 2 === 0) {
        even_numbers.push(token)
      } else {
        odd_numbers.push(token)
      }
    } else if (isPureAlpha(token)) {
      alphabets.push(token.toUpperCase())
    } else {
      special_characters.push(token)
    }
  }

  return {
    is_success: true,
    user_id: buildUserId(),
    email: USER.email,
    roll_number: USER.rollNumber,
    odd_numbers,
    even_numbers,
    alphabets,
    special_characters,
    sum: String(sum),
    concat_string: buildConcatString(data),
  }
}

module.exports = { processBfhl, buildUserId, USER }
