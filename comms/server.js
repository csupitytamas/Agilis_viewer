const express = require("express")
const app = express()
const cors = require("cors")
const PORT = 3000
const { v4: uuidv4 } = require("uuid")

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

function addSampleWaitlists() {
  const id1 = 100001
  waitlists.set(id1, {
    id: id1,
    title: "Introduction to Angular",
    description: "Learn the basics of Angular framework",
    presentation: {
      id: uuidv4(),
      title: "Angular Basics",
      content: {
        slides: [
          {
            id: uuidv4(),
            backgroundPath: "None",
            pageNumber: 0,
            widgets: [
              {
                id: uuidv4(),
                positionX: 40,
                positionY: 30,
                width: 50,
                height: 20,
                type: "TextBox",
                text: "Introduction to Angular",
                fontSize: 24,
              },
            ],
          },
          {
            id: uuidv4(),
            backgroundPath: "None",
            pageNumber: 1,
            widgets: [
              {
                id: uuidv4(),
                positionX: 30,
                positionY: 20,
                width: 60,
                height: 15,
                type: "TextBox",
                text: "Components and Modules",
                fontSize: 20,
              },
              {
                id: uuidv4(),
                positionX: 35,
                positionY: 40,
                width: 50,
                height: 40,
                type: "TextBox",
                text: "Angular applications are built using components that are organized into modules.",
                fontSize: 14,
              },
            ],
          },
          {
            id: uuidv4(),
            backgroundPath: "None",
            pageNumber: 2,
            widgets: [
              {
                id: uuidv4(),
                positionX: 40,
                positionY: 50,
                width: 30,
                height: 20,
                type: "TextBox",
                text: "Services and Dependency Injection",
                fontSize: 16,
              },
            ],
          },
        ],
      },
      thumbnail: "/assets/thumbnails/angular.jpg",
      createdBy: { id: 1, name: "John Doe" },
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublic: true,
    },
    maxParticipants: 0,
    currentSlide: 0,
    currentParticipants: [],
    startedAt: new Date(),
    createdAt: new Date(),
    createdBy: { id: 1, name: "John Doe" },
    status: "active",
  })

  const id2 = 100002
  waitlists.set(id2, {
    id: id2,
    title: "Web Development Best Practices",
    description: "Modern techniques for web development",
    presentation: {
      id: uuidv4(),
      title: "Web Dev Best Practices",
      content: {
        slides: [
          {
            id: uuidv4(),
            backgroundPath: "None",
            pageNumber: 0,
            widgets: [
              {
                id: uuidv4(),
                positionX: 35,
                positionY: 40,
                width: 50,
                height: 20,
                type: "TextBox",
                text: "Modern Web Development",
                fontSize: 22,
              },
            ],
          },
          {
            id: uuidv4(),
            backgroundPath: "None",
            pageNumber: 1,
            widgets: [
              {
                id: uuidv4(),
                positionX: 40,
                positionY: 30,
                width: 40,
                height: 15,
                type: "TextBox",
                text: "Performance Optimization",
                fontSize: 18,
              },
              {
                id: uuidv4(),
                positionX: 30,
                positionY: 50,
                width: 60,
                height: 30,
                type: "TextBox",
                text: "Optimize your web applications for better performance and user experience.",
                fontSize: 14,
              },
            ],
          },
        ],
      },
      thumbnail: "/assets/thumbnails/webdev.jpg",
      createdBy: { id: 2, name: "Jane Smith" },
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublic: true,
    },
    maxParticipants: 20,
    currentSlide: 1,
    currentParticipants: [
      { id: 101, name: "User 1" },
      { id: 102, name: "User 2" },
    ],
    startedAt: new Date(),
    createdAt: new Date(),
    createdBy: { id: 2, name: "Jane Smith" },
    status: "active",
  })

  const id3 = 1003
  waitlists.set(id3, {
    id: id3,
    title: "JavaScript Fundamentals",
    description: "Core concepts of JavaScript programming",
    presentation: {
      id: uuidv4(),
      title: "JavaScript Fundamentals",
      content: {
        slides: [
          {
            id: uuidv4(),
            backgroundPath: "None",
            pageNumber: 0,
            widgets: [
              {
                id: uuidv4(),
                positionX: 40,
                positionY: 40,
                width: 40,
                height: 20,
                type: "TextBox",
                text: "JavaScript Basics",
                fontSize: 20,
              },
            ],
          },
        ],
      },
      thumbnail: "/assets/thumbnails/javascript.jpg",
      createdBy: { id: 1, name: "John Doe" },
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublic: false,
    },
    maxParticipants: 15,
    currentSlide: 0,
    currentParticipants: [],
    createdAt: new Date(),
    createdBy: { id: 1, name: "John Doe" },
    status: "inactive",
  })
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
  addSampleWaitlists()
})



