const express = require("express")
const axios = require("axios")
const app = express()
const cors = require("cors")
const PORT = 3000

app.use(express.json())

// CORS config-
app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        const allowedOrigins = ['http://localhost:4200', 'https://viewer.norbif.hu'];

        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        } else {
          console.log(`Origin ${origin} not allowed by CORS`);
          return callback(new Error('Not allowed by CORS'), false);
        }
      },
      credentials: true,
    }),
);


// Slideok tarolasa
const presentations = new Map()

// Test data for development
const testPresentationId = 'ed9659b5-f83f-41af-8886-75a694ea38f7';
presentations.set(testPresentationId, {
  id: testPresentationId,
  isRunning: true,
  currentSlideData: {
    id: "ed9659b5-f83f-41af-8886-75a694ea38f7",
    backgroundPath: "None",
    pageNumber: 2,
    widgets: [
      {
        id: "df40825c-a676-4ffb-9cfd-1540354fa0c2",
        positionX: 40,
        positionY: 50,
        width: 30,
        height: 20,
        type: "TextBox",
        text: "Ez csak egy próba szöveg",
        fontSize: 11
      }
    ]
  },
  startedAt: new Date(),
  updatedAt: new Date()
});
console.log(`Test presentation ${testPresentationId} added to memory`);

const testPresentationId2 = 'ed9659b5-f83f-41af-8886-75a694ea38f6';
presentations.set(testPresentationId2, {
  id: testPresentationId2,
  isRunning: false,
  currentSlideData: {
    id: "ed9659b5-f83f-41af-8886-75a694ea38f6",
    backgroundPath: "None",
    pageNumber: 2,
    widgets: [
      {
        id: "df40825c-a676-4ffb-9cfd-1540354fa0c2",
        positionX: 40,
        positionY: 50,
        width: 30,
        height: 20,
        type: "TextBox",
        text: "Ez csak egy próba szöveg",
        fontSize: 11
      }
    ]
  },
  startedAt: new Date(),
  updatedAt: new Date()
});
console.log(`Test presentation ${testPresentationId2} added to memory`);

// Controller API URL
const CONTROLLER_URL = "https://viewer.norbif.hu/api/v1"

app.get("/api/:id/status", (req, res) => {
  const presentationId = req.params.id
  const presentation = presentations.get(presentationId)

  if (!presentation) {
    return res.json({ isRunning: false })
  }

  res.json({ isRunning: presentation.isRunning })
})

app.get("/api/:id/current-slide", (req, res) => {
  const presentationId = req.params.id
  const presentation = presentations.get(presentationId)

  if (!presentation || !presentation.isRunning || !presentation.currentSlideData) {
    return res.status(200).json({ running: false, slideNumber: null })
  }

  res.json({
    running: true,
    slideNumber: presentation.currentSlideData.pageNumber || null,
    slideData: presentation.currentSlideData,
  })
})

// Hibakezelés
function respondError(res, err, status = 500) {
  console.error("Error:", err)
  return res.status(status).json({ success: false, error: err.message || err })
}

// Start
app.post("/:id/start", (req, res) => {
  try {
    const presentationId = req.params.id
    const { slide } = req.body

    if (!slide) throw new Error("Missing slide data in start request")

    presentations.set(presentationId, {
      id: presentationId,
      isRunning: true,
      currentSlideData: slide,
      startedAt: new Date(),
    })

    console.log(`START received for presentation ${presentationId}`)
    res.json({ success: true })
  } catch (err) {
    respondError(res, err)
  }
})

// Stop
app.post("/:id/stop", (req, res) => {
  try {
    const presentationId = req.params.id
    const presentation = presentations.get(presentationId)

    if (presentation) {
      presentation.isRunning = false
      presentation.closedAt = new Date()
    }

    console.log(`STOP received for presentation ${presentationId}`)
    res.json({ success: true })
  } catch (err) {
    respondError(res, err)
  }
})

// Next
app.post("/:id/next", (req, res) => {
  try {
    const presentationId = req.params.id
    const { slide } = req.body
    const presentation = presentations.get(presentationId)

    if (!slide) throw new Error("Missing slide data in next request")

    if (presentation) {
      presentation.currentSlideData = slide
      presentation.updatedAt = new Date()
    } else {
      presentations.set(presentationId, {
        id: presentationId,
        isRunning: true,
        currentSlideData: slide,
        startedAt: new Date(),
        updatedAt: new Date(),
      })
    }

    console.log(`NEXT received for presentation ${presentationId}`)
    res.json({ success: true })
  } catch (err) {
    respondError(res, err)
  }
})

// Previous
app.post("/:id/previous", (req, res) => {
  try {
    const presentationId = req.params.id
    const { slide } = req.body
    const presentation = presentations.get(presentationId)

    if (!slide) throw new Error("Missing slide data in previous request")

    if (presentation) {
      presentation.currentSlideData = slide
      presentation.updatedAt = new Date()
    } else {
      presentations.set(presentationId, {
        id: presentationId,
        isRunning: true,
        currentSlideData: slide,
        startedAt: new Date(),
        updatedAt: new Date(),
      })
    }

    console.log(`PREVIOUS received for presentation ${presentationId}`)
    res.json({ success: true })
  } catch (err) {
    respondError(res, err)
  }
})

// Goto
app.post("/:id/goto", (req, res) => {
  try {
    const presentationId = req.params.id
    const { gotoSlide, slide } = req.body
    const presentation = presentations.get(presentationId)

    if (gotoSlide === undefined) throw new Error("Missing gotoSlide number")
    if (!slide) throw new Error("Missing slide data in goto request")

    if (presentation) {
      presentation.currentSlideData = slide
      presentation.updatedAt = new Date()
    } else {
      presentations.set(presentationId, {
        id: presentationId,
        isRunning: true,
        currentSlideData: slide,
        startedAt: new Date(),
        updatedAt: new Date(),
      })
    }

    console.log(`GOTO received to slide ${gotoSlide} for presentation ${presentationId}`)
    res.json({ success: true })
  } catch (err) {
    respondError(res, err)
  }
})

// Restart
app.post("/:id/restart", (req, res) => {
  try {
    const presentationId = req.params.id
    const { slide } = req.body

    if (!slide) throw new Error("Missing slide data in restart request")

    presentations.set(presentationId, {
      id: presentationId,
      isRunning: true,
      currentSlideData: slide,
      startedAt: new Date(),
      updatedAt: new Date(),
    })

    console.log(`RESTART received for presentation ${presentationId}`)
    res.json({ success: true })
  } catch (err) {
    respondError(res, err)
  }
})

app.get("/api/presentations", (req, res) => {
  const activePresentation = []

  presentations.forEach((presentation, id) => {
    if (presentation.isRunning) {
      activePresentation.push({
        id,
        startedAt: presentation.startedAt,
        currentSlide: presentation.currentSlideData?.pageNumber,
      })
    }
  })

  res.json({ presentations: activePresentation })
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

