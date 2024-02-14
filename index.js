const express = require("express");
const ejs = require("ejs");
const mysql = require("mysql");

// Create express app
const app = express();

// define db parameters
const db = mysql.createConnection({
  host: "localhost",
  user: "student",
  password: "whitenoise4999",
  database: "csi4999",
});

// connect to db
db.connect((err) => {
  if (err) {
    throw err;
  } else {
    console.log(`Successfully connected to the DB....`);
  }
});

// Initialize Body Parser Middleware to parse data sent by users in the request object
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // to parse HTML form data

// Initialize ejs Middleware
app.set("view engine", "ejs");
app.use("/public", express.static(__dirname + "/public"));

// get routes for currently implemented ejs pages
app.get("/", (req, res) => {
    res.render("index", {error: 0});
});

app.get("/createacc", (req, res) => {
    res.render("createacc", {error: 0});
});

//query routes
app.post("/createaccount", (req, res) => {
  let data = { userid: "0", username: req.body.username.trim(), password: req.body.password.trim(), name: req.body.realname.trim() };
  let pass = req.body.password.trim();
  let sql = `INSERT INTO users SET ?`;
  let query = db.query(sql, data, (err, result) => {
    if (err) {
        console.log(err);
        res.render("createacc", { error: 1 });
    } else {
      // pass user login data
      const selectName = `SELECT userid, username, name FROM users WHERE password = ?`;
      db.query(selectName, pass, (err, userdata) => {
          res.render("main", {data: userdata[0]});
      });
    }
  });
});

app.post("/loginaccount", (req, res) => {
  let username = req.body.username.trim();
  let pass = req.body.password.trim();
  let sql = `SELECT * FROM users WHERE username = ? AND password = ?`;
  let query = db.query(sql, [username, pass], (err, result) => {
    if (err) {
        console.log(err);
        throw err;
    }
    if (result.length == 0) {
        res.render("index", { error: 1 });
    } else {
      // pass user login data
      const selectName = `SELECT userid, username, name FROM users WHERE password = ?`;
      db.query(selectName, pass, (err, userdata) => {
          res.render("main", {data: userdata[0]});
      });
    }
  });
});

app.post("/addmemberquery", (req, res) => {
  // pass user login data
  const { userid, username, name } = req.body;
  const userdata = { userid, username, name };
  console.log(userdata);
  let addmemberdata = { memberid: "0", userid: req.body.userid.trim(), membername: req.body.addname.trim(), membercategory: req.body.addcategory.trim() };
  let sql = `INSERT INTO members SET ?`;
  let query = db.query(sql, addmemberdata, (err, result) => {
    if (err) {
      console.log(err);
      throw err;
    }
    if (result.length == 0) {
      res.render("addmember", {data: userdata, error: 1 });
    } else {
      res.render("main", {data: userdata});
    }
  });
});

app.post("/editmemberquery", (req, res) => {
  // pass user login data
  const { userid, username, name } = req.body;
  const userdata = { userid, username, name };
  console.log(userdata);
  let memberid = req.body.editid.trim();
  let category = req.body.editcategory.trim();
  const submit = req.body.submit;
  if(submit === "Apply"){
    let sql = `UPDATE members SET membercategory = ? WHERE memberid = ?`;
    let query = db.query(sql, [category, memberid], (err, result) => {
      if (err) {
        console.log(err);
        throw err;
      }
      if (result.length == 0) {
        res.render("editmember", {data: userdata, error: 1 });
      } else {
        res.render("main", {data: userdata});
      }
    });
  } else if(submit === "Delete"){
    let sql = `DELETE FROM members WHERE memberid = ?`;
    let query = db.query(sql, memberid, (err, result) => {
      if (err) {
        console.log(err);
        throw err;
      }
      if (result.length == 0) {
        res.render("editmember", {data: userdata, error: 1 });
      } else {
        res.render("main", {data: userdata});
      }
    });
  } else {
    console.log("something's amiss...")
    res.render("editmember", {data: userdata, error: 1 });
  }
});

// routes for displaying more pages
app.post("/main", (req, res) => {
    const { userid, username, name } = req.body;
    const userdata = { userid, username, name };
    console.log(userdata);
    res.render("main", {data: userdata});
});

app.post("/addmember", (req, res) => {
    const { userid, username, name } = req.body;
    const userdata = { userid, username, name };
    console.log(userdata);
    res.render("addmember", {data: userdata});
});

app.post("/editmember", (req, res) => {
    let id = req.body.userid.trim();
    let sql = `SELECT * FROM members WHERE userid = ?`;
    let query = db.query(sql, id, (err, result) => {
    if (err) {
      console.log(err);
      throw err;
    } else {
      // pass user login data
      const { userid, username, name } = req.body;
      const userdata = { userid, username, name };
      console.log(result);
      res.render("editmember", {members: result, data: userdata});
    }
  });
});

app.post("/logout", (req, res) => {
  res.render("index", {error: 0});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
