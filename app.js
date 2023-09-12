const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
require("./utils/mahasiswa");
const Mahasiswa = require("./models/mahasiswa");
const session = require("express-session");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const { body, validationResult, check } = require("express-validator");
const methodOverride = require("method-override");
const Perpustakaan = require("./models/perpustakaan");
const port = 1234;

app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("secret"));
app.use(
  session({
    secret: "secret",
    cookie: { maxAge: 6000 },
    resave: true,
    saveUninitialized: true,
  })
);
app.use(methodOverride("_method"));
app.use(flash());

// home
app.get("/", (req, res) => {
  const mhs = [
    {
      nama: "Zacky Hafsari",
      kelas: "informatika",
      email: "zackyhafsa089@gmail.com",
    },
    {
      nama: "Abrar Wahid",
      kelas: "informatika",
      email: "abrar@gmail.com",
    },
    {
      nama: "Ahmad nur",
      kelas: "informatika",
      email: "Ahmad@gmail.com",
    },
  ];
  res.render("mahasiswa/index", {
    title: "Home",
    layout: "layout/main",
    mhs,
  });
});

// about
app.get("/about", (req, res) => {
  res.render("mahasiswa/about", {
    title: "about",
    layout: "layout/main",
  });
});

// mahasiswa
app.get("/mhs", async (req, res) => {
  const mhs = await Mahasiswa.find();
  res.render("mahasiswa/mhs", {
    title: "mhs",
    layout: "layout/main",
    mhs,
    msg: req.flash("msg"),
  });
});

// tambah mahasiswa
app.get("/mhs/add", (req, res) => {
  res.render("mahasiswa/addMhs", {
    title: "Add",
    layout: "layout/main",
  });
});

// terima form tambah
app.post(
  "/mhs",
  [
    body("npm", "Npm harus 9 digit")
      .isLength(9)
      .custom(async (value) => {
        const duplikat = await Mahasiswa.findOne({ npm: value });
        if (duplikat) {
          throw new Error("NPM sudah digunakan");
        }
        return true;
      }),
    check("email", "email yang dimasukkan salah, silahkan masukkan email dengan benar").isEmail(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(404).json({ errors: errors.array() });
      res.render("mahasiswa/addMhs", {
        title: "add",
        layout: "layout/main",
        errors: errors.array(),
      });
    } else {
      Mahasiswa.insertMany(req.body);
      req.flash("msg", "Data berhasil Ditambahkan");
      res.redirect("/mahasiswa/mhs");
    }
  }
);

// edit mahasiswa
app.get("/mhs/update/:npm", async (req, res) => {
  const mhs = await Mahasiswa.findOne({ npm: req.params.npm });
  res.render("mahasiswa/mhsEdit", {
    title: "Edit",
    layout: "layout/main",
    mhs,
  });
});

// terima form edit
app.put(
  "/mhs",
  [
    body("npm", "npm harus 9 digit")
      .isLength(9)
      .custom(async (value, { req }) => {
        const duplikat = await Mahasiswa.findOne({ npm: value });
        if (value != req.body.npm && duplikat) {
          throw new Error("NPM sudah digunakan");
        }
        return true;
      }),
    check("email", "email yang dimasukkan salah, silahkan masukkan email dengan benar").isEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(404).json({ errors: errors.array() });
      res.render("mahasiswa/addMhs", {
        title: "add",
        layout: "layout/main",
        errors: errors.array(),
        mhs: req.body,
      });
    } else {
      await Mahasiswa.updateOne(
        { npm: req.body.npm },
        {
          $set: {
            nama: req.body.nama,
            npm: req.body.npm,
            kelas: req.body.kelas,
            email: req.body.email,
          },
        }
      );
      req.flash("msg", "Data berhasil Diubah");
      res.redirect("/mhs");
    }
  }
);

// menghapus mahasiswa
// app.get("/mhs/delete/:npm", async (req, res) => {
//   const mhs = await Mahasiswa.find({ npm: req.params.npm });
//   if (!mhs) {
//     res.send("Nama kontak tidak ada");
//   } else {
//     await Mahasiswa.deleteMany({ npm: req.params.npm });
//     req.flash("msg", "Data mahasiswa berhasil dihapus");
//     res.redirect("/mhs");
//   }
// });

// hapus mahasiswa
app.delete("/mhs", async (req, res) => {
  await Mahasiswa.deleteOne({ npm: req.body.npm });
  req.flash("msg", "data berhasil dihapus");
  res.redirect("/mhs");
});

// detail
app.get("/mhs/detail/:npm", async (req, res) => {
  const detail = await Mahasiswa.findOne({ npm: req.params.npm });
  res.render("detailMhs", {
    title: "detail",
    layout: "layout/main",
    detail,
  });
});

// perpustakaan
app.get("/perpus", async (req, res) => {
  const perpus = await Perpustakaan.find();
  res.render("perpustakaan/perpustakaan", {
    title: "Perpustakaan",
    layout: "layout/main",
    perpus,
    msg: req.flash("msg"),
  });
});

// detail buku perpustakaan
app.get("/perpus/detail/:npm", async (req, res) => {
  const detail = await Perpustakaan.findOne({ npm: req.params.npm });
  res.render("perpustakaan/detailPerpus", {
    title: "Detail",
    layout: "layout/main",
    detail,
  });
});

// tambah buku
app.get("/perpus/add", (req, res) => {
  res.render("perpustakaan/AddBook", {
    title: "Daftar",
    layout: "layout/main",
  });
});

app.post(
  "/perpus",
  [
    body("npm", "Npm harus 9 digit")
      .isLength(9)
      .custom(async (value) => {
        const duplikat = await Perpustakaan.findOne({ npm: value });
        if (duplikat) {
          throw new Error("NPM sudah digunakan");
        }
        return true;
      }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(404).json({ errors: errors.array() });
      res.render("perpustakaan/AddBook", {
        title: "Daftar",
        layout: "layout/main",
        errors: errors.array(),
      });
    } else {
      await Perpustakaan.insertMany(req.body);
      req.flash("msg", "Data berhasil Ditambahkan");
      res.redirect("/perpus");
    }
  }
);

// edit buku
app.get("/perpus/edit/:npm", async (req, res) => {
  const buku = await Perpustakaan.findOne({ npm: req.params.npm });
  res.render("perpustakaan/editBook", {
    title: "Edit",
    layout: "layout/main",
    buku,
  });
});

app.put(
  "/perpus",
  [
    body("npm", "npm harus 9 digit")
      .isLength(9)
      .custom(async (value, { req }) => {
        const duplikat = await Mahasiswa.findOne({ npm: value });
        if (value != req.body.npm && duplikat) {
          throw new Error("NPM sudah digunakan");
        }
        return true;
      }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(404).json({ errors: errors.array() });
      res.render("perpustakaan/editBook", {
        title: "add",
        layout: "layout/main",
        errors: errors.array(),
        buku: req.body,
      });
    } else {
      await Perpustakaan.updateOne(
        { npm: req.body.npm },
        {
          $set: {
            nama: req.body.nama,
            npm: req.body.npm,
            kelas: req.body.kelas,
            buku: req.body.buku,
          },
        }
      );
      req.flash("msg", "Data berhasil Diubah");
      res.redirect("/perpus");
    }
  }
);

// menghapus data perpustakaan
app.delete("/perpus", async (req, res) => {
  await Perpustakaan.deleteOne({ npm: req.body.npm });
  req.flash("msg", "Data berhasil dihapus");
  res.redirect("/perpus");
});

app.listen(port, () => {
  console.log(`server sedang berjalan di http://localhost:${port}`);
});
