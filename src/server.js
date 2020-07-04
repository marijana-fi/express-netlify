const env = require("dotenv").config({ path: "../env" });
const stripe = require("stripe")(process.env.REACT_APP_STRIPE_SECRET_KEY);
const express = require("express");
const serverless = require("serverless-http");
const router = express.Router();
const cors = require("cors");
const app = express();

router.get("/test", (req, res) => {
	res.json({
		hello: "hi!",
	});
});

router.post("/", async (req, res) => {
	const body = req.body;

	const options = {
		...body,
		amount: req.body.amount,
		currency: "USD",
	};

	try {
		const paymentIntent = await stripe.paymentIntents.create(options);
		res.json(paymentIntent);
	} catch (err) {
		res.json(err);
	}
});

app.use(express.json());
app.use(cors());
app.use(`/.netlify/functions/server`, router);

// app.listen(process.env.PORT || 8080, () => {
// 	console.log("listening on port 8080");
// });
module.exports = app;
module.exports.handler = serverless(app);
