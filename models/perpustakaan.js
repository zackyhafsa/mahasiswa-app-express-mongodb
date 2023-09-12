const mongoose = require("mongoose");
const Perpustakaan = mongoose.model("Perpustakaan", {
  nama: {
    type: String,
    required: true,
  },
  kelas: {
    type: String,
    required: true,
  },
  npm: {
    type: Number,
    required: true,
  },
  buku: {
    type: String,
    required: true,
  },
});

module.exports = Perpustakaan;
