const express = require("express")
const app = express()
const cors = require("cors")
const axios = require("axios")
const PORT = 3000

const PRESENTER_API_URL = "https://dev.backend.demosystems.hu/api/v1"

app.use(express.json())
app.use(cors())

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

app.get("/api/waitlists", async (req, res) => {
  try {
    res.json({
      waitlists: [
      ],
    })
  } catch (error) {
    console.error("Error fetching waitlists:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch waitlists",
    })
  }
})

app.get("/api/:id/status", async (req, res) => {
  const waitlistId = req.params.id
  console.log(`Checking status for waitlist ${waitlistId}`)

  try {
    const response = await axios.get(`${PRESENTER_API_URL}/waitlist/${waitlistId}`)
    console.log("Presenter API response:", response.data)

    if (response.data.success && response.data.waitlist) {
      const isRunning = response.data.waitlist.status === "active"
      console.log(`Waitlist ${waitlistId} is running: ${isRunning}`)
      res.json({ isRunning })
    } else {
      console.log(`Waitlist ${waitlistId} not found or not successful`)
      res.json({ isRunning: false })
    }
  } catch (error) {
    console.error(`Error checking waitlist ${waitlistId} status:`, error)
    res.json({ isRunning: false })
  }
})

app.get("/api/:id/current-slide", async (req, res) => {
  const waitlistId = req.params.id
  console.log(`Fetching current slide for waitlist ${waitlistId}`)

  try {
    const waitlistResponse = await axios.get(`${PRESENTER_API_URL}/waitlist/${waitlistId}`)
    console.log("Waitlist API response:", waitlistResponse.data)

    if (
        waitlistResponse.data.success &&
        waitlistResponse.data.waitlist &&
        waitlistResponse.data.waitlist.status === "active"
    ) {
      const waitlist = waitlistResponse.data.waitlist
      const currentSlideNumber = waitlist.currentSlide

      if (waitlist.presentation && waitlist.presentation.id) {
        const presentationId = waitlist.presentation.id
        console.log(`Fetching presentation data for ID: ${presentationId}`)

        try {
          const presentationResponse = await axios.get(`${PRESENTER_API_URL}/presentation/${presentationId}`)
          console.log("Presentation API response:", presentationResponse.data)

          if (presentationResponse.data.success && presentationResponse.data.presentation) {
            const presentation = presentationResponse.data.presentation

            if (
                presentation.content &&
                presentation.content.slides &&
                presentation.content.slides.length > 0
            ) {
              const slideData = presentation.content.slides[currentSlideNumber];

              if (slideData) {
                console.log(`Found slide with pageNumber ${currentSlideNumber} for waitlist ${waitlistId}`)
                res.json({
                  running: true,
                  slideNumber: currentSlideNumber,
                  slideData,
                })
                return
              } else {
                const fallbackSlide = presentation.content.slides[0];
                res.json({
                  running: true,
                  slideNumber: currentSlideNumber,
                  slideData: fallbackSlide,
                })
                return
              }
            }
          }
        } catch (presentationError) {
          console.error(`Error fetching presentation data for ID ${presentationId}:`, presentationError)
        }
      }

      console.log(`No slide content available for waitlist ${waitlistId}, creating placeholder`)
      res.json({
        running: true,
        slideNumber: currentSlideNumber,
        slideData: {
          id: `slide-${currentSlideNumber}`,
          backgroundPath: "None",
          pageNumber: currentSlideNumber,
          widgets: [
            {
              id: `widget-${currentSlideNumber}-1`,
              positionX: 40,
              positionY: 40,
              width: 50,
              height: 20,
              type: "TextBox",
              text: `Slide ${currentSlideNumber} - ${waitlist.presentation.title || "Presentation"}`,
              fontSize: 24,
            },
          ],
        },
      })
    } else {
      console.log(`Waitlist ${waitlistId} not running or not found`)
      res.json({ running: false, slideNumber: null })
    }
  } catch (error) {
    console.error(`Error fetching current slide for waitlist ${waitlistId}:`, error)
    res.json({ running: false, slideNumber: null })
  }
})

app.get("/api/:id/raw", async (req, res) => {
  const waitlistId = req.params.id
  try {
    const response = await axios.get(`${PRESENTER_API_URL}/waitlist/${waitlistId}`)
    res.json(response.data)
  } catch (error) {
    console.error(`Error fetching raw data for waitlist ${waitlistId}:`, error)
    res.status(500).json({ success: false, error: "Failed to fetch data" })
  }
})

app.get("/api/presentation/:id/raw", async (req, res) => {
  const presentationId = req.params.id
  try {
    const response = await axios.get(`${PRESENTER_API_URL}/presentation/${presentationId}`)
    res.json(response.data)
  } catch (error) {
    console.error(`Error fetching raw presentation data for ID ${presentationId}:`, error)
    res.status(500).json({ success: false, error: "Failed to fetch presentation data" })
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
  console.log(`API is available at http://localhost:${PORT}/api`)
})