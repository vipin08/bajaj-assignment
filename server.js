"use strict"

const path = require("path")
const express = require("express")
const cors = require("cors")
const { processBfhl, buildUserId } = require("./bfhl")

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json({ limit: "1mb" }))
app.use(express.static(path.join(__dirname, "public")))

app.post("/bfhl", (req, res) => {
  try {
    const result = processBfhl(req.body)
    return res.status(200).json(result)
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      is_success: false,
      user_id: buildUserId(),
      error: err.message || "Internal Server Error",
    })
  }
})

app.get("/bfhl", (_req, res) => {
  return res.status(200).json({ operation_code: 1 })
})

app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }))

app.get("/download", (_req, res) => {
  const zipPath = path.join(__dirname, "download", "bfhl-fullstack-test.zip")
  res.download(zipPath, "bfhl-fullstack-test.zip", (err) => {
    if (err && !res.headersSent) {
      res.status(404).json({ is_success: false, error: "Download not available" })
    }
  })
})

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.use((req, res) => {
  if (req.path.startsWith("/bfhl") || req.path.startsWith("/api")) {
    return res.status(404).json({ is_success: false, error: "Not Found" })
  }
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.listen(PORT, () => {
  console.log(`Server Started on http://localhost:${PORT}`)
})

module.exports = app
