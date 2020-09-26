require("dotenv").config()
const app = require("./src/app")


const { PORT = 3001, SERVER_TIMEOUT = 15000 } = process.env

const server = app.listen(PORT, async () => {
    console.log("✔✔ express server started at port: " + PORT)
});

server.setTimeout(+SERVER_TIMEOUT)