const express = require("express");
const cookieParser = require("cookie-parser");
const sessions = require("express-session");
const http = require("http");
var parseUrl = require("body-parser");
const app = express();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

app.use(express.json());

var mysql = require("mysql");
const { encode } = require("punycode");

let encodeUrl = parseUrl.urlencoded({ extended: false });

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

//session middleware
app.use(
  sessions({
    secret: "thisismysecrctekey",
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60, // 1 hour
      name: "user_cookie", //cookie name
    },
    resave: false,
  })
);

app.use(cookieParser());

var con = mysql.createConnection({
  host: "localhost",
  user: "root", // my username
  password: "", // my password
  database: "loginsystem",
});

con.connect(function (err) {
  if (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to connect to the database" });
    return;
  }

  app.post("/register", (req, res) => {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var password = req.body.password;

    // checking user already registered or no
    con.query(
      `SELECT * FROM users WHERE BINARY email = '${email}'`,
      function (err, result) {
        if (err) {
          console.log(err);
        }
        if (Object.keys(result).length > 0) {
          res.status(401).send("Email already registered");
        } else {
          //creating user page in userPage function
          function userPage() {
            //creating session
            req.session.user = {
              firstname: firstName,
              lastname: lastName,
              email: email,
              password: password,
            };
          }
          // inserting new user data
          var sql = `INSERT INTO users (firstname, lastname, email, password) VALUES ('${firstName}', '${lastName}', '${email}', '${password}')`;
          con.query(sql, function (err, result) {
            if (err) {
              console.log(err);
            } else {
              // using userPage function for creating user page
              userPage();
              res.status(200).send("Successfully registered");
            }
          });
        }
      }
    );
  });

  app.get("/dashboard", (req, res) => {
    if (req.session.user) {
      return res.json({
        firstname: req.session.user.firstname,
        lastname: req.session.user.lastname,
      });
    }
    res.status(401).send("Invalid session");
  });

  app.post("/login", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    // Use a parameterized query to prevent SQL injection
    con.query(
      "SELECT * FROM users WHERE BINARY email = ? AND password = ?",
      [email, password],
      function (err, result) {
        if (err) {
          console.log(err);
          res.status(500).json({ error: "Failed to execute query" });
          return;
        }

        if (result.length > 0) {
          // User exists
          req.session.user = {
            id: result[0].id,
            firstname: result[0].firstname,
            lastname: result[0].lastname,
            email: email,
            password: password,
          };

          res.status(200).send("Login successful");
        } else {
          // User does not exist
          res.status(401).json({ error: "Invalid email or password" });
        }
      }
    );
  });
});

app.get("/logout", function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
      res.status(500).send({ error: "Failed to destroy session" });
    } else {
      res.status(200).send({ message: "Session destroyed successfully" });
      /* console.log("Session destroyed"); */
    }
  });
});

app.post("/researchPaperList", function (req, res) {
  var search = req.body.search;
  var mode = req.body.mode;
  var sortBy = req.body.sortBy;
  const id = req.session.user.id;
  //console.log(id);

  if (mode === "myResearchPaper") {
    if (search === "") {
      var sql = `SELECT * FROM researchpaper_data WHERE userid = ${id}`;
    } else {
      var sql = `SELECT * FROM researchpaper_data WHERE userid = ${id} AND title LIKE '%${search}%'`;
    }
    con.query(sql, function (err, result) {
      if (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to execute query" });
        return;
      }

      if (result.length > 0) {
        res.status(200).json(result);
      } else {
        // nothing found
        res.status(201).send("Files not found");
      }
    });
  } else if (mode === "researchPaper") {
    if (search === "") {
      var sql = `SELECT * FROM researchpaper_data`;
    } else {
      var sql = `SELECT * FROM researchpaper_data WHERE title LIKE '%${search}%'`;
    }
    con.query(sql, function (err, result) {
      if (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to execute query" });
        return;
      }

      if (result.length > 0) {
        res.status(200).json(result);
      } else {
        // nothing found
        res.status(201).send("Files not found");
      }
    });
  } else if (mode === "journal") {
    if (search === "") {
      var sql = `SELECT * FROM journal_data`;
    } else {
      var sql = `SELECT * FROM journal_data WHERE journal_title LIKE '%${search}%'`;
    }
    con.query(sql, function (err, result) {
      if (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to execute query" });
        return;
      }

      if (result.length > 0) {
        res.status(200).json(result);
      } else {
        // nothing found
        res.status(201).send("Files not found");
      }
    });
  } else {
    return res.status(201).json("");
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./files/researchpapers");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${req.session.user.id}.pdf`);
  },
});

const fileFilter = (req, file, cb) => {
  // Accept only PDF files
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only PDF is allowed!"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

app.post("/uploadresearch", upload.single("file"), (req, res) => {
  /* console.log(req.body.name);
  console.log(req.body.subject);
  console.log(req.file); */

  var uploadsql =
    "INSERT INTO `researchpaper_data` ( `userid`, `title`, `subject`, `file_name`) VALUES (?, ?, ?, ?);";
  con.query(
    uploadsql,
    [req.session.user.id, req.body.title, req.body.subject, req.file.filename],
    function (err, result) {
      if (err) {
        console.log(err);
        res.status(201).json({ error: "File upload unsuccessful" });
        return;
      } else {
        res.status(200).send("File upload successful");
      }
    }
  );
});

app.get("/viewResearchPaper/:paperId", async (req, res) => {
  try {
    const paperId = req.params.paperId;
    const filenamesql =
      "SELECT file_name FROM `researchpaper_data` WHERE id = ?";
    var fileName = "";

    con.query(filenamesql, [paperId], function (err, result) {
      if (err) {
        console.log(err);
        res.status(500).json({ error: "Database error" });
        return;
      }

      if (result.length > 0) {
        const fileName = result[0].file_name;

        if (fileName === null) {
          return res.status(404).send("File name is not available");
        }

        const filePath = path.join(__dirname, "files/researchpapers", fileName);

        if (fs.existsSync(filePath)) {
          res.download(filePath, fileName, (err) => {
            if (err) {
              console.error("An error occurred:", err);
              res.status(500).send("Internal Server Error");
            }
          });
        } else {
          console.error(`File not found: ${filePath}`);
          res.status(404).send("File not found");
        }
      } else {
        // nothing found
        return res.status(404).send("File not found");
      }
    });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/deleteResearchPaper/:paperid", (req, res) => {
  var paperid = req.params.paperid;
  var userid = req.session.user.id;
  var del = "DELETE FROM researchpaper_data WHERE id = ? AND userid = ?";
  con.query(del, [paperid, userid], function (err, result) {
    if (err) {
      console.log(err);
      res.status(201).json({ error: "Deletion unsuccessful" });
      return;
    } else {
      res.status(200).send("Deletion successful");
    }
  });
});

app.listen(4000, () => {
  console.log("Server running on port 4000");
});