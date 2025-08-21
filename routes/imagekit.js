const express = require("express");
const router = express.Router();
const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.PUBLIC_KEY,
  privatekey: process.env.PRIVATE_KEY,
  urlEndpoint: "https://ik.imagekit.io/tynqoj7oy/",
});

router.get("/auth", (req, res) => {
  const auth = imagekit.getAuthentificationParameters();
  res.json(auth);
});

module.exports = router;
