const express = require("express");
const path = require("path");
const ejs = require("ejs");
const multer = require("multer");

//set Storage Engine

const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

//init Upload
const Upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("myImage"); //array

//check File Type
function checkFileType(file, cb) {
  // Alowed ext
  const fileTypes = /jpeg|jpg|png|gif/;
  //check ext
  const extname = fileTypes.test(
    path.extname(file.originalname).toLocaleLowerCase()
  );
  //check mime type
  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extname) {
    return cb(null, true);
  } else {
    cb("Error Images Only");
  }
}

// app
const app = express();

//ejs
app.set("view engine", "ejs");

//public folder
app.use(express.static("./public"));

//GET || POST
app.get("/", (req, res) => res.render("index"));
app.post("/upload", (req, res) => {
  Upload(req, res, (err) => {
    if (err) {
      res.render("index", { msg: err });
    } else {
      if (req.file === undefined) {
        res.render("index", { msg: "Error : No file selected" });
      } else {
        res.render("index", {
          msg: "file Uploaded",
          file: `uploads/${req.file.filename}`,
        });
      }
    }
  });
});
//run
const PORT = 3000;
app.listen(PORT, console.log(`server is runing on port ${PORT}`));
