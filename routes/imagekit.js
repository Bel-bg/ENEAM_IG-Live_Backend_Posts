const express = require("express");
const router = express.Router();
const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

router.get("/auth", (req, res) => {
  const auth = imagekit.getAuthentificationParameters();
  res.json(auth);
});

module.exports = router;
