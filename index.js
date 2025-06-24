const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const port = process.env.PORT || 4000;
require("dotenv").config();

const postRoutes = require("./routes/post");
const userRoutes = require("./routes/user");

const app = express();
app.use(express.json());

const corsOptions = {
	origin: ['http://localhost:3000'],
	credentials: true,
	optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

mongoose.connect(process.env.MONGODB_STRING)
mongoose.connection.once("open", () => console.log("Connected to MongoDB Atlas."))

app.use("/posts", postRoutes);
app.use("/users", userRoutes);

if(require.main === module){
	app.listen(port, "0.0.0.0", () => {
	  console.log(`Server is listening on port ${port}.`);
	});
}

module.exports = {app,mongoose};