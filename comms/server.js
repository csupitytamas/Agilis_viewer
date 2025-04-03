const express = require("express")
const app = express()
const cors = require("cors")
const PORT = 3000
const { v4: uuidv4 } = require("uuid")
const {createTestWaitlists} = require("./data/test-waitlists");

app.use(express.json())

app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true)

        const allowedOrigins = ["http://localhost:4200", "https://viewer.norbif.hu"]

        if (allowedOrigins.includes(origin)) {
          return callback(null, true)
        } else {
          console.log(`Origin ${origin} not allowed by CORS`)
          return callback(new Error("Not allowed by CORS"), false)
        }
      },
      credentials: true,
    }),
)

const waitlists = new Map()

function loadTestData() {
  try {
    createTestWaitlists(waitlists)
    console.log(`Successfully loaded test data with ${waitlists.size} waitlists`)
  } catch (error) {
    console.error("Error loading test data:", error)
  }
}

app.get("/api/waitlists", (req, res) => {
  const waitlistArray = []

  waitlists.forEach((waitlist) => {
    if (waitlist.status === "active") {
      waitlistArray.push({
        id: waitlist.id,
        title: waitlist.title,
        description: waitlist.description,
        maxParticipants: waitlist.maxParticipants,
        currentParticipants: waitlist.currentParticipants.length,
        startedAt: waitlist.startedAt,
        createdAt: waitlist.createdAt,
        createdBy: waitlist.createdBy,
        status: waitlist.status,
        presentation: {
          id: waitlist.presentation.id,
          title: waitlist.presentation.title,
          thumbnail: waitlist.presentation.thumbnail,
        },
      })
    }
  })

  res.json({ waitlists: waitlistArray })
})

app.get("/api/:id/status", (req, res) => {
  const waitlistId = Number.parseInt(req.params.id)
  const waitlist = waitlists.get(waitlistId)

  if (!waitlist) {
    return res.json({ isRunning: false })
  }

  const isRunning = waitlist.status === "active"
  res.json({ isRunning })
})

app.get("/api/:id/current-slide", (req, res) => {
  const waitlistId = Number.parseInt(req.params.id)
  const waitlist = waitlists.get(waitlistId)

  if (!waitlist || waitlist.status !== "active") {
    return res.status(200).json({ running: false, slideNumber: null })
  }

  const slideData = waitlist.presentation.content.slides[waitlist.currentSlide]

  res.json({
    running: true,
    slideNumber: waitlist.currentSlide,
    slideData,
  })
})

app.post("/api/:id/join", (req, res) => {
  const waitlistId = Number.parseInt(req.params.id)
  const { userId, userName } = req.body
  const waitlist = waitlists.get(waitlistId)

  if (!waitlist) {
    return res.status(404).json({ success: false, error: "Waitlist not found" })
  }

  if (waitlist.status !== "active") {
    return res.status(400).json({ success: false, error: "Waitlist is not active" })
  }

  if (waitlist.maxParticipants > 0 && waitlist.currentParticipants.length >= waitlist.maxParticipants) {
    return res.status(400).json({ success: false, error: "Maximum participants reached" })
  }

  const participant = { id: userId, name: userName }

  if (!waitlist.currentParticipants.some((p) => p.id === userId)) {
    waitlist.currentParticipants.push(participant)
  }

  res.json({ success: true })
})

app.post("/api/:id/leave", (req, res) => {
  const waitlistId = Number.parseInt(req.params.id)
  const { userId } = req.body
  const waitlist = waitlists.get(waitlistId)

  if (!waitlist) {
    return res.status(404).json({ success: false, error: "Waitlist not found" })
  }

  waitlist.currentParticipants = waitlist.currentParticipants.filter((p) => p.id !== userId)

  res.json({ success: true })
})

app.post("/api/:id/start", (req, res) => {
  const waitlistId = Number.parseInt(req.params.id)
  const waitlist = waitlists.get(waitlistId)

  if (!waitlist) {
    return res.status(404).json({ success: false, error: "Waitlist not found" })
  }

  waitlist.status = "active"
  waitlist.startedAt = new Date()
  waitlist.currentSlide = 0

  res.json({ success: true })
})

app.post("/api/:id/stop", (req, res) => {
  const waitlistId = Number.parseInt(req.params.id)
  const waitlist = waitlists.get(waitlistId)

  if (!waitlist) {
    return res.status(404).json({ success: false, error: "Waitlist not found" })
  }

  waitlist.status = "inactive"
  waitlist.closedAt = new Date()
  waitlist.currentParticipants = []

  res.json({ success: true })
})

app.post("/api/:id/next", (req, res) => {
  const waitlistId = Number.parseInt(req.params.id)
  const waitlist = waitlists.get(waitlistId)

  if (!waitlist) {
    return res.status(404).json({ success: false, error: "Waitlist not found" })
  }

  if (waitlist.status !== "active") {
    return res.status(400).json({ success: false, error: "Waitlist is not active" })
  }

  const totalSlides = waitlist.presentation.content.slides.length

  if (waitlist.currentSlide < totalSlides - 1) {
    waitlist.currentSlide++
  }

  res.json({
    success: true,
    currentSlide: waitlist.currentSlide,
  })
})

app.post("/api/:id/previous", (req, res) => {
  const waitlistId = Number.parseInt(req.params.id)
  const waitlist = waitlists.get(waitlistId)

  if (!waitlist) {
    return res.status(404).json({ success: false, error: "Waitlist not found" })
  }

  if (waitlist.status !== "active") {
    return res.status(400).json({ success: false, error: "Waitlist is not active" })
  }

  if (waitlist.currentSlide > 0) {
    waitlist.currentSlide--
  }

  res.json({
    success: true,
    currentSlide: waitlist.currentSlide,
  })
})

app.post("/api/:id/goto", (req, res) => {
  const waitlistId = Number.parseInt(req.params.id)
  const { slideNumber } = req.body
  const waitlist = waitlists.get(waitlistId)

  if (!waitlist) {
    return res.status(404).json({ success: false, error: "Waitlist not found" })
  }

  if (waitlist.status !== "active") {
    return res.status(400).json({ success: false, error: "Waitlist is not active" })
  }

  const totalSlides = waitlist.presentation.content.slides.length

  if (slideNumber >= 0 && slideNumber < totalSlides) {
    waitlist.currentSlide = slideNumber
  } else {
    return res.status(400).json({ success: false, error: "Invalid slide number" })
  }

  res.json({
    success: true,
    currentSlide: waitlist.currentSlide,
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
  loadTestData()
})



