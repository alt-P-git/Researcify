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

//for authorization
function isAuthenticated(req, res, next) {
  if (req.session) {
    return next();
  } else {
    return res.status(401).send("Unauthorized");
  }
}
function isAuthenticatedUser(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  } else {
    return res.status(401).send("Unauthorized");
  }
}
function isAuthenticatedPeer(req, res, next) {
  if (req.session && req.session.peer) {
    return next();
  } else {
    return res.status(401).send("Unauthorized");
  }
}
function isAuthenticatedAdmin(req, res, next) {
  if (req.session && req.session.admin) {
    return next();
  } else {
    return res.status(401).send("Unauthorized");
  }
}
function isAuthenticatedPublisher(req, res, next) {
  if (req.session && req.session.publisher) {
    return next();
  } else {
    return res.status(401).send("Unauthorized");
  }
}

con.connect(function (err) {
  if (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to connect to the database" });
    return;
  }

  app.get("/landingpage", (req, res) => {
    var countquery = "SELECT (SELECT COUNT(*) FROM users) AS usercnt, (SELECT COUNT(*) FROM researchpaper_data) AS researchcnt, (SELECT COUNT(*) FROM journal_data) AS journalcnt";
    con.query(countquery, function (err, result) {
      if (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to execute query" });
        return;
      }
      if (result.length > 0) {
        res.status(200).json(result);
      } else {
        res.status(201).send("No data found");
      }
    });
  });

  app.post("/register", (req, res) => {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
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
              firstname: firstname,
              lastname: lastname,
              email: email,
              password: password,
            };
          }
          // inserting new user data
          var sql = `INSERT INTO users (firstname, lastname, email, password) VALUES ('${firstname}', '${lastname}', '${email}', '${password}')`;
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
    else if (req.session.admin) {
      return res.json({
        firstname: req.session.admin.firstname,
        lastname: req.session.admin.lastname,
      });
    }
    else if (req.session.publisher) {
      return res.json({
        journal_name: req.session.publisher.journal_name,
      });
    }
    res.status(401).send("Invalid session");
  });

  app.post("/login", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    var role = req.body.role;
    if (role === "user") {
      var sql = "SELECT * FROM users WHERE BINARY email = ? AND password = ?";
    } else if (role === "admin") {
      var sql = "SELECT * FROM admin WHERE BINARY email = ? AND password = ?";
    } else if (role === "peer") {
      var sql = "SELECT * FROM peer WHERE BINARY email = ? AND password = ?";
    } else if (role === "publisher") {
      var sql =
        "SELECT * FROM publisher WHERE BINARY email = ? AND password = ?";
    } else {
      return res.status(401).send("Invalid role");
    }
    con.query(sql, [email, password], function (err, result) {
      if (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to execute query" });
        return;
      }
      if (result.length > 0) {
        if (role != "publisher") {
          req.session[role] = {
            id: result[0].id,
            firstname: result[0].firstname,
            lastname: result[0].lastname,
            email: email,
            password: password,
          };
        } else {
          req.session[role] = {
            id: result[0].id,
            journal_name: result[0].journal_name,
            email: email,
            password: password,
          };
        }

        res.status(200).send("Login successful");
      } else {
        // User does not exist
        res.status(401).json({ error: "Invalid email or password" });
      }
    });
  });
});

app.get("/logout", function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
      res.status(500).send({ error: "Failed to destroy session" });
    } else {
      res.status(200).send({ message: "Session destroyed successfully" });
    }
  });
});

app.get("/userprofile", isAuthenticatedUser, (req, res) => {
  var userid = req.session.user.id;
  var sql = "SELECT * FROM users WHERE id = ?";
  con.query(sql, [userid], function (err, result) {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Database error" });
      return;
    }
    if (result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(201).send("User not found");
    }
  });
});

app.post("/updateuser", isAuthenticatedUser, (req, res) => {
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var email = req.body.email;
  var password = req.body.password;
  var id = req.session.user.id;
  var emailquery = `SELECT * FROM users WHERE BINARY email = ? AND id <> ?`;
  if (firstname === "" || lastname === "" || email === "" || password === "") {
    return res.status(400).send("Empty fields");
  };
  con.query(emailquery, [email, id], function (err, result) {
      if (err) {
        console.log(err);
      }
      if (Object.keys(result).length > 0) {
        res.status(401).send("Email already registered");
      } else {
        var sql = "UPDATE users SET firstname = ?, lastname = ?, email = ?, password = ? WHERE id = ?";
        con.query(sql, [firstname, lastname, email, password, id], function (err, result) {
            if (err) {
              console.log(err);
              res.status(500).json({ error: "Database error" });
              return;
            }
            if (result.affectedRows > 0) {
              res.status(200).send("User updated successfully");
            } else {
              res.status(401).send("User not found");
            }
          });
      }
    }
  );
});

app.get("/subjects", function (req, res) {
  var sql = "SELECT subjects FROM researchpaper_subjects";
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Failed to fetch subjects" });
      return;
    }
    if (result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(201).send("No data found");
    }
  });
});

app.post("/researchPaperList", isAuthenticated, function (req, res) {
  var search = req.body.search;
  var mode = req.body.mode;

    const id = req.session.user.id;
  
  const subject = req.body.subject;

  if (mode === "myResearchPaper") {
    if (search === "") {
      var sql = `SELECT r.id, r.userid, r.title, r.subject, r.pub_date, r.peer_review, r.description, COUNT(v.researchpaper_id) AS view_count FROM researchpaper_data AS r LEFT JOIN researchpaper_views AS v ON r.id = v.researchpaper_id WHERE r.userid = ${id}`;
    } else {
      var sql = `SELECT r.id, r.userid, r.title, r.subject, r.pub_date, r.peer_review, r.description, COUNT(v.researchpaper_id) AS view_count FROM researchpaper_data AS r LEFT JOIN researchpaper_views AS v ON r.id = v.researchpaper_id WHERE r.userid = ${id} AND title LIKE '%${search}%'`;
    }
    if (subject !== "ALL" && subject !== "") {
      sql = sql + ` AND r.subject = '${subject}'`;
    };
    sql = sql + ` GROUP BY r.id;`;
    con.query(sql, function (err, result) {
      if (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to execute query" });
        return;
      }

      if (result.length > 0) {
        res.status(200).json(result);
      } else {
        res.status(201).send("Files not found");
      }
    });
  } else if (mode === "researchPaper") {
    if (search === "") {
      var sql = `SELECT r.id, r.userid, r.title, r.subject, r.pub_date, r.description, COUNT(v.researchpaper_id) AS view_count FROM researchpaper_data AS r LEFT JOIN researchpaper_views AS v ON r.id = v.researchpaper_id WHERE r.peer_review = "accepted"`;
    } else {
      var sql = `SELECT r.id, r.userid, r.title, r.subject, r.pub_date, r.description, COUNT(v.researchpaper_id) AS view_count FROM researchpaper_data AS r LEFT JOIN researchpaper_views AS v ON r.id = v.researchpaper_id WHERE r.title LIKE '%${search}%' AND r.peer_review = "accepted"`;
    }
    if (subject !== "ALL" && subject !== "") {
      sql = sql + ` AND r.subject = '${subject}'`;
    };
    sql = sql + ` GROUP BY r.id;`;
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
      var sql = `SELECT jd.journal_id, pub.journal_name, jd.journal_title, jd.pub_date, COUNT(jv.journal_id) AS view_count FROM journal_data AS jd JOIN publisher AS pub ON jd.publisher_id = pub.id LEFT JOIN journal_views AS jv ON jd.journal_id = jv.journal_id GROUP BY jd.journal_id;`;
    } else {
      var sql = `SELECT jd.journal_id, pub.journal_name, jd.journal_title, jd.pub_date, COUNT(jv.journal_id) AS view_count FROM journal_data AS jd JOIN publisher AS pub ON jd.publisher_id = pub.id LEFT JOIN journal_views AS jv ON jd.journal_id = jv.journal_id WHERE journal_title LIKE '%${search}%' GROUP BY jd.journal_id;`;
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
        res.status(201).send("Files not found");
      }
    });
  } else {
    return res.status(201).json("");
  }
});

app.post("/adduser", isAuthenticatedAdmin, function (req, res) {
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var email = req.body.email;
  var password = req.body.password;

  con.query(
    `SELECT * FROM users WHERE BINARY email = '${email}'`,
    function (err, result) {
      if (err) {
        console.log(err);
      }
      if (Object.keys(result).length > 0) {
        res.status(401).send("Email already registered");
      } else {
        var sql = `INSERT INTO users (firstname, lastname, email, password) VALUES ('${firstname}', '${lastname}', '${email}', '${password}')`;
        con.query(sql, function (err, result) {
          if (err) {
            console.log(err);
          } else {
            res.status(200).send("Successfully added user");
          }
        });
      }
    }
  );
});

app.post("/addpublisher", isAuthenticatedAdmin, function (req, res) {
  var journal_name = req.body.journal_name;
  var email = req.body.email;
  var password = req.body.password;

  con.query(
    `SELECT * FROM publisher WHERE BINARY email = '${email}'`,
    function (err, result) {
      if (err) {
        console.log(err);
      }
      if (Object.keys(result).length > 0) {
        res.status(401).send("Email already registered");
      } else {
        var sql = `INSERT INTO publisher (journal_name, email, password) VALUES ('${journal_name}', '${email}', '${password}')`;
        con.query(sql, function (err, result) {
          if (err) {
            console.log(err);
          } else {
            res.status(200).send("Successfully added publisher");
          }
        });
      }
    }
  );
});

/* app.post("/deletepublisher", isAuthenticatedAdmin, function (req, res) {
  var publisher_id = req.body.publisher_id;
  con.query(
    `SELECT * FROM publisher WHERE id = '${publisher_id}'`,
    function (err, result) {
      if (err) {
        console.log(err);
      }
      if (Object.keys(result).length > 0) {
        var sql = `DELETE FROM publisher WHERE id = '${publisher_id}'`;
        con.query(sql, function (err, result) {
          if (err) {
            console.log(err);
          } else {

            res.status(200).send("Successfully deleted publisher");
          }
        });
      } else {
        res.status(401).send("Publisher not found");
      }
    }
  );
}); */

app.post("/myJournals", isAuthenticatedPublisher, function (req, res) {
  var search = req.body.search;
  if (search === "") {
    var sql = `SELECT jd.journal_id, pub.journal_name, jd.journal_title, jd.pub_date, COUNT(jv.journal_id) AS view_count FROM journal_data AS jd JOIN publisher AS pub ON jd.publisher_id = pub.id LEFT JOIN journal_views AS jv ON jd.journal_id = jv.journal_id WHERE jd.publisher_id = ? GROUP BY jd.journal_id;`;
  } else {
    var sql = `SELECT jd.journal_id, pub.journal_name, jd.journal_title, jd.pub_date, COUNT(jv.journal_id) AS view_count FROM journal_data AS jd JOIN publisher AS pub ON jd.publisher_id = pub.journal_id LEFT JOIN journal_views AS jv ON jd.journal_id = jv.journal_id WHERE journal_title LIKE '%${search}%' AND jd.publisher_id = ? GROUP BY jd.journal_id;`;
  }
  con.query(sql, [req.session.publisher.id], function (err, result) {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Failed to execute query" });
      return;
    }
    if (result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(201).send("Files not found");
    }
  });
});

app.post("/reviewPaperList", isAuthenticatedPeer, function (req, res) {
  var search = req.body.search;
  var subject = req.body.subject;
  if (search === "") {
    var sql = `SELECT id, userid, title, subject, pub_date, description FROM researchpaper_data WHERE peer_review = "pending"`;
  } else {
    var sql = `SELECT id, userid, title, subject, pub_date, description FROM researchpaper_data WHERE title LIKE '%${search}%' AND peer_review = "pending"`;
  }
  if (subject !== "ALL" && subject !== "") {
    sql = sql + ` AND subject = '${subject}'`;
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
      res.status(201).send("Files not found");
    }
  });
});

app.post("/review/:paperId", isAuthenticatedPeer, function (req, res) {
  var paperId = req.params.paperId;
  var decision = req.body.decision;
  var sql = `UPDATE researchpaper_data SET peer_review = ? WHERE id = ?`;

  con.query(sql, [decision, paperId], function (err, result) {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Failed to execute query" });
      return;
    }
    if (result.affectedRows > 0) {
      res.status(200).send("Review submitted successfully");
    } else {
      res.status(404).send("Paper not found");
    }
  });
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

app.post("/uploadresearch", isAuthenticatedUser, upload.single("file"), (req, res) => {
    if (req.body.title === "" || req.body.subject === "") {
      return res.status(400).send("Title or subject is empty");
    }
    if (req.file === undefined) {
      return res.status(400).send("File is empty");
    }
    var uploadsql =
      "INSERT INTO `researchpaper_data` ( `userid`, `title`, `subject`, `file_name`, `description`) VALUES (?, ?, ?, ?, ?);";
    con.query(
      uploadsql,
      [
        req.session.user.id,
        req.body.title,
        req.body.subject,
        req.file.filename,
        req.body.description
      ],
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
  }
);

app.get("/view/:type/:paperId", isAuthenticated, async (req, res) => {
  try {
    const paperId = req.params.paperId;
    const type = req.params.type;
    var filenamesql = `SELECT file_name FROM researchpaper_data WHERE id = ?`;
    if (type == "journal") {
      filenamesql = `SELECT file_name FROM journal_data WHERE journal_id = ?`;
    };
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
        var filePath = path.join(__dirname, "files/researchpapers", fileName);
        if (type == "journal") {
          filePath = path.join(__dirname, "files/journals", fileName);
        }
        if (fs.existsSync(filePath)) {
          res.download(filePath, fileName, (err) => {
            if (err) {
              console.error("An error occurred:", err);
              res.status(500).send("Internal Server Error");
            }
            else if (req.session.user && type == "researchpaper") {
              viewsql = `INSERT INTO researchpaper_views (researchpaper_id, viewer_id) VALUES (?, ?);`;
              con.query(viewsql, [paperId, req.session.user.id], function (err, result) {});
            }
            else if (req.session.user && type == "journal") {
              viewsql = `INSERT INTO journal_views (journal_id, viewer_id) VALUES (?, ?);`;
              con.query(viewsql, [paperId, req.session.user.id], function (err, result) {});
            }
          });
        } else {
          res.status(404).send("File not found");
        }
      } else {
        return res.status(404).send("File not found");
      }
    });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/deleteFile/:type/:paperid", (req, res) => {
  const paperid = req.params.paperid;
  const type = req.params.type;

  var userid = "";
  if (req.session.admin) {
    var sql = "SELECT userid FROM researchpaper_data WHERE id = ?";
    if (type === "journal") {
      sql = "SELECT publisher_id FROM journal_data WHERE id = ?";
    };
    con.query(sql, [paperid], function (err, result) {
      if (err) {
        res.status(500).json({ error: "Database error" });
        return;
      } else if (result.length > 0) {
        userid = result[0].userid;
      } else {
        return res.status(404).send("User not found");
      }
    });
  } else if (req.session.user) {
    userid = req.session.user.id;
  } else if (req.session.publisher) {
    userid = req.session.publisher.id;
  } else {
    return res.status(401).send("Unauthorized");
  }
  var filenamesql = "";
  if (type === "researchpaper") {
    filenamesql = "SELECT file_name FROM `researchpaper_data` WHERE id = ? AND userid = ?";
  }
  else if (type === "journal") {
    filenamesql = "SELECT file_name FROM `journal_data` WHERE journal_id = ? AND publisher_id = ?";
  };

  con.query(filenamesql, [paperid, userid], function (err, result) {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Database error" });
      return;
    }

    if (result.length > 0) {
      const fileName = result[0].file_name;

      if (fileName === null) {
        return res.status(404).send("File not present on server");
      }

      var filePath = "";
      if (type === "researchpaper") {
        filePath = path.join(__dirname, "files/researchpapers", fileName);
      }
      else if (type === "journal") {
        filePath = path.join(__dirname, "files/journals", fileName);
      };
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
          var del = "";
          if (type === "researchpaper") {
            del = "DELETE FROM researchpaper_data WHERE id = ? AND userid = ?";
          }
          else if (type === "journal") {
            del = "DELETE FROM journal_data WHERE journal_id = ? AND publisher_id = ?";
          };
          con.query(del, [paperid, userid], function (err, result) {
            if (err) {
              console.log(err);
              res.status(201).json({ error: "Deletion unsuccessful" });
              return;
            } else {
              var delview = "";
              if (type === "researchpaper") {
                delview = "DELETE FROM researchpaper_views WHERE researchpaper_id = ?";
              }
              else if (type === "journal") {
                delview = "DELETE FROM journal_views WHERE journal_id = ?";
              };
              con.query(delview, [paperid], function (err, result) {
                if (err) {
                  //console.log(err);
                  res.status(201).json({ error: "Deletion unsuccessful" });
                  return;
                } else {
                  res.status(200).send("Deletion successful");
                };
            });
            }
          });
        } catch (err) {
          console.error("An error occurred:", err);
          res.status(500).send("Internal Server Error");
        }
      } else {
        res.status(404).send("File not present on server");
      }
    } else {
      return res.status(404).send("Unathorized access");
    }
  });
});

const storageJournal = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./files/journals");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${req.session.publisher.id}.pdf`);
  },
});

const journalFileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only PDF is allowed!"), false);
  }
};

const uploadJournal = multer({
  storage: storageJournal,
  fileFilter: journalFileFilter,
});

app.post("/uploadjournal", isAuthenticatedPublisher, uploadJournal.single("file"), (req, res) => {
    if (req.body.title === "") {
      return res.status(400).send("Title is empty");
    }
    if (req.file === undefined) {
      return res.status(400).send("File is empty");
    }
    var uploadsql = "INSERT INTO `journal_data` ( `publisher_id`,`journal_title`, `file_name`) VALUES (?, ?, ?);";
    con.query( uploadsql, [req.session.publisher.id, req.body.title, req.file.filename], function (err, result) {
        if (err) {
          console.log(err);
          res.status(201).json({ error: "File upload unsuccessful" });
          return;
        } else {
          res.status(200).send("File upload successful");
        }
      }
    );
  }
);

app.get("/userprofile/:userid", isAuthenticatedUser, (req, res) => {
  var userid = req.params.userid;
  var sql = "SELECT firstname, lastname, email FROM users WHERE id = ?";
  con.query(sql, [userid], function (err, result) {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Database error" });
      return;
    }
    if (result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(201).send("User not found");
    }
  });
});

app.listen(4000, () => {
  console.log("Server running on port 4000");
});