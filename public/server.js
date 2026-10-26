
const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

const publicFolder = path.join(__dirname, "public");
const indexFile = path.join(publicFolder, "index.html");

console.log("Project location:", __dirname);
console.log("Public folder exists:", fs.existsSync(publicFolder));
console.log("Index file location:", indexFile);
console.log("Index file exists:", fs.existsSync(indexFile));

app.use(express.json());
app.use(express.static(publicFolder));

app.get("/", (req, res) => {
    res.sendFile(indexFile, (err) => {
        if (err) {
            console.error("Could not load index.html:", err.message);
            if (!res.headersSent) {
                res.status(500).send("Could not load index.html. Check the terminal.");
            }
        }
    });
});

app.get("/api", (req, res) => {
    res.json({
        success: true,
        message: "MORROW Espress Co. backend is working!"
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

const menu = [
    {
        id: 1,
        name: "Classic Espresso",
        category: "Coffee",
        description: "A rich, balanced espresso shot.",
        price: null
    },
    {
        id: 2,
        name: "Flat White",
        category: "Coffee",
        description: "Espresso with smooth steamed milk.",
        price: null
    },
    {
        id: 3,
        name: "Iced Latte",
        category: "Cold Coffee",
        description: "Espresso, chilled milk, and ice.",
        price: null
    },
    {
        id: 4,
        name: "Matcha Latte",
        category: "Matcha",
        description: "A smooth matcha drink with milk.",
        price: null
    }
];

app.get("/api/menu", (req, res) => {
    res.json({
        success: true,
        data: menu
    });
});
