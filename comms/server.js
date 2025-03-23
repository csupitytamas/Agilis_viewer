const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Dummy állapot változók
let presentationId = 1;
let currentSlide = 0;
let status = "stopped";

// GET /status/:id
app.get('/api/v1/display/status/:id', (req, res) => {
    res.json({
        success: true,
        presentationId: parseInt(req.params.id),
        currentSlide,
        status
    });
});

// POST /command
app.post('/api/v1/display/command', (req, res) => {
    const { action, gotoSlide } = req.body;

    switch(action) {
        case "start":
            status = "running";
            currentSlide = 1;
            break;
        case "stop":
            status = "stopped";
            break;
        case "next":
            currentSlide++;
            break;
        case "previous":
            if (currentSlide > 1) currentSlide--;
            break;
        case "goto":
            if (gotoSlide !== undefined) currentSlide = gotoSlide;
            break;
        case "restart":
            status = "running";
            currentSlide = 1;
            break;
        default:
            return res.status(400).json({ success: false, message: "Invalid action" });
    }

    res.json({
        success: true,
        message: `Action ${action} performed`,
        currentSlide
    });
});

// POST /feedback
app.post('/api/v1/display/feedback', (req, res) => {
    console.log("Feedback received:", req.body);
    res.json({ success: true });
});

// GET /current-slide/:id
app.get('/api/v1/display/current-slide/:id', (req, res) => {
    res.json({
        success: true,
        presentationId: parseInt(req.params.id),
        currentSlide
    });
});



app.listen(port, () => {
    console.log(`Display backend listening at http://localhost:${port}`);
});
