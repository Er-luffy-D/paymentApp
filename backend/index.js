const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 3000;

app.use(cors({}));
app.use(express.json());
const router = require("./routes");

app.use("/api/v1", router);
app.listen(PORT, () => console.log(`Server is listening at ${PORT}`));
