const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const app = express();
require("dotenv").config();

app.use(bodyParser.json());
app.use(helmet({
    crossOriginResourcePolicy: false,
}));
app.use(cors())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const ReactAppFolder = (...args) => {
    const ReactAppPath = "../frontend/build".split("/")
    return path.join(__dirname, ...ReactAppPath, ...args)
}

const ReactApp = function (req, res) {
    res.send(
        fs.readFileSync(
            ReactAppFolder("index.html"),
            { encoding: "utf-8" }
        )
    )
}

app.use("/static", express.static(ReactAppFolder("static")));

const routeDir = path.join(__dirname, process.env.API_FILE);

console.log("Loading all API in", routeDir)
fs.readdirSync(routeDir).forEach((file) => {
    const route = require(path.join(routeDir, file));
    const routeBasePath = `/api/${file.replace('.js', '')}`;

    console.log(`\nLoading ${file}`)

    route.stack.forEach((middleware) => {
        if (middleware.route) {
            const methods = Object.keys(middleware.route.methods).join(', ').toUpperCase();
            console.log(`Loaded route: ${methods} ${routeBasePath}${middleware.route.path}`);
        }
    });

    app.use(routeBasePath, route);
});

app.use("*", ReactApp);

app.listen(process.env.PORT, () =>{
    console.log(`\nServer is running on port ${process.env.PORT}`);
})