const { v4: uuidv4 } = require("uuid")

function createTestWaitlists(waitlists) {
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

    const id3 = 100003
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

    console.log(`Loaded ${waitlists.size} test waitlists`)
    return waitlists
}

module.exports = { createTestWaitlists }

