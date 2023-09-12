const mongoose = require("mongoose");

const Mahasiswa = mongoose.model("Mahasiswa", {
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
  email: {
    type: String,
    required: true,
  },
});
module.exports = Mahasiswa;
