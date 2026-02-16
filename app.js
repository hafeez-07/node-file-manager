const express = require("express");
const app = express();

const path = require("path");
const fs = require("fs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.get("/", (req, res) => {
  fs.readdir("files", (err, files) => {
    res.render("index", { files });
  });
});

app.post("/create", (req, res) => {
  const { title, details } = req.body;

  fs.writeFile(`files/${title.replaceAll(" ", "")}.txt`, details, (err) => {
    if (err) console.error("writeFile error:", err);
  });
  res.redirect("/");
});

app.get("/files/:filename", (req, res) => {
  const filename = req.params.filename;

  const filePath = path.join(__dirname, "files", filename);
  fs.readFile(filePath, "utf8", (err, filedata) => {
    if (err) {
      console.error("readFile error:", err);
      return res.status(404).send("File not found");
    }

    res.render("show", {
      filename,
      filedata,
    });
  });
});

app.get("/edit/:filename", (req, res) => {
  const filename = req.params.filename;
  res.render("edit", {
    filename,
  });
});

app.post("/edit", (req, res) => {
  const prevFileName = path.join(
    __dirname,
    "files",
    `${req.body.previousName}`,
  );
  const newFileName = path.join(__dirname, "files", `${req.body.newName}.txt`);

  fs.rename(prevFileName, newFileName, (err) => {
    res.redirect("/");
  });
});

app.post("/delete/:filename", (req, res) => {
  const filename = path.join(__dirname, "files", `${req.params.filename}`);
  fs.rm(filename, (err) => {
    if (err) {
      console.log("could not delete");
    }
    res.redirect("/");
  });
});

app.listen(3000, () => {
  console.log("App running in localhost:3000");
});
