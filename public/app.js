"use strict"

const $ = (id) => document.getElementById(id)

const payload = $("payload")
const submitBtn = $("submit")
const resetBtn = $("reset")
const statusBadge = $("status-badge")
const resultRegion = $("result-region")
const emptyState = $("empty-state")
const resultBody = $("result-body")

const DEFAULT_BODY = `{
  "data": ["a", "1", "334", "4", "R", "$"]
}`

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    const raw = chip.getAttribute("data-sample")
    try {
      payload.value = JSON.stringify(JSON.parse(raw), null, 2)
    } catch {
      payload.value = raw
    }
    payload.focus()
  })
})

resetBtn.addEventListener("click", () => {
  payload.value = DEFAULT_BODY
  setStatus("idle")
  showEmpty()
  payload.focus()
})

submitBtn.addEventListener("click", sendRequest)
payload.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === "Enter") sendRequest()
})

function setStatus(state, label) {
  statusBadge.className = "status-badge"
  if (state === "ok") statusBadge.classList.add("ok")
  if (state === "err") statusBadge.classList.add("err")
  statusBadge.textContent = label || state
}

function showEmpty() {
  resultRegion.classList.add("is-empty")
  emptyState.style.display = "flex"
  resultBody.hidden = true
}

function setLoading(on) {
  submitBtn.disabled = on
  submitBtn.classList.toggle("loading", on)
  submitBtn.querySelector(".btn-label").textContent = on ? "Sending…" : "Send request"
}

async function sendRequest() {
  let parsed
  try {
    parsed = JSON.parse(payload.value)
  } catch (e) {
    setStatus("err", "invalid json")
    renderError("Your input is not valid JSON. Please fix it and try again.")
    return
  }

  setLoading(true)
  setStatus("idle", "…")

  try {
    const res = await fetch("/bfhl", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed),
    })
    const data = await res.json()

    if (!res.ok || data.is_success === false) {
      setStatus("err", `error ${res.status}`)
      renderError(data.error || "Request failed.", data)
    } else {
      setStatus("ok", `200 · success`)
      renderResult(data)
    }
  } catch (err) {
    setStatus("err", "network")
    renderError("Network error — is the server running?")
  } finally {
    setLoading(false)
  }
}

function tokenEl(value, kind) {
  const span = document.createElement("span")
  span.className = "token" + (kind ? " " + kind : "")
  span.textContent = value
  return span
}

function fillRow(el, items, kind) {
  el.innerHTML = ""
  if (!items || items.length === 0) {
    const empty = document.createElement("span")
    empty.className = "token-empty"
    empty.textContent = "—"
    el.appendChild(empty)
    return
  }
  items.forEach((v) => el.appendChild(tokenEl(v, kind)))
}

function renderResult(data) {
  resultRegion.classList.remove("is-empty")
  emptyState.style.display = "none"
  resultBody.hidden = false

  $("r-userid").textContent = data.user_id ?? "—"
  $("r-sum").textContent = data.sum ?? "—"
  $("r-roll").textContent = data.roll_number ?? "—"

  fillRow($("r-even"), data.even_numbers, "num")
  fillRow($("r-odd"), data.odd_numbers, "num")
  fillRow($("r-alpha"), data.alphabets)
  fillRow($("r-special"), data.special_characters, "special")

  $("r-concat").textContent = data.concat_string && data.concat_string.length ? data.concat_string : "—"

  $("r-raw").querySelector("code").textContent = JSON.stringify(data, null, 2)
}

function renderError(message, data) {
  resultRegion.classList.remove("is-empty")
  emptyState.style.display = "none"
  resultBody.hidden = false

  $("r-userid").textContent = (data && data.user_id) || "—"
  $("r-sum").textContent = "—"
  $("r-roll").textContent = "—"
  fillRow($("r-even"), [])
  fillRow($("r-odd"), [])
  fillRow($("r-alpha"), [])
  fillRow($("r-special"), [])
  $("r-concat").textContent = "—"
  $("r-raw").querySelector("code").textContent = data
    ? JSON.stringify(data, null, 2)
    : JSON.stringify({ is_success: false, error: message }, null, 2)
}
