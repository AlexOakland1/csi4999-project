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

app.post("/addeventquery", (req, res) => {
  // pass user login data
  const { userid, username, name } = req.body;
  const userdata = { userid, username, name };
  console.log(userdata);
  let selectedPersons = req.body.person;
  console.log(selectedPersons);
  let today = new Date().toISOString().slice(0, 10)
  const time = today + " " + req.body.time.trim() + ":00";
  console.log(time);
  let addeventdata = { eventname: req.body.eventname.trim(), eventdesc: req.body.description.trim(), eventdatetime: time, eventimportance: req.body.importance.trim(), userid: req.body.userid.trim() };
  let geteventdata = { eventname: req.body.eventname.trim(), eventdesc: req.body.description.trim(), eventdatetime: time, eventimportance: req.body.importance.trim(), userid: req.body.userid.trim() };
  let sql = `INSERT INTO events SET ?`;
  let sql2 = `SELECT eventid FROM events WHERE eventname = ? AND eventdesc = ? AND eventdatetime = ? AND eventimportance = ? AND userid = ?`;
  let sql3 = `INSERT INTO eventmembers (eventid, memberid) VALUES ?`;
  let query = db.query(sql, addeventdata, (err, result) => {
      if (err) {
          console.log(err);
          throw err;
      }
      if (result.length == 0) {
          res.render("addentry", {data: userdata, error: 1 });
      } else {
          db.query(sql2, Object.values(geteventdata), (err, rows) => {
              if (err) {
                  console.log(err);
                  throw err;
              }
              if (!selectedPersons) {
                  res.render("main", {data: userdata});
              } else {
                  const eventid = rows[0].eventid;
                  if (!Array.isArray(selectedPersons)) {
                        selectedPersons = [selectedPersons];
                  }
                  if (selectedPersons != undefined){
                    const eventmembersData = selectedPersons.map(person => [eventid, parseInt(person)]);
                    db.query(sql3, [eventmembersData], (err, result) => {
                        if (err) {
                            console.log(err);
                            res.render("addentry", {data: userdata, error: 1 });
                        } else {
                            res.render("main", {data: userdata});
                        }
                    });
                  } else {
                    res.render("main", {data: userdata});
                  }
              }
          });
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

app.post("/selecteventquery", (req, res) => {
  // pass user login data
  const { userid, username, name } = req.body;
  const userdata = { userid, username, name };
  console.log(userdata);
  let eventid = req.body.editid.trim();
  let userid2 = req.body.userid.trim();
  let sql = `SELECT * FROM events WHERE eventid = ?`;
  let sql2 = `SELECT * FROM eventmembers WHERE eventid = ?`;
  let sql3 = `SELECT * FROM members WHERE userid IN (SELECT userid FROM eventmembers WHERE eventid = ?) AND userid = ?`;
  let sql4 = `DELETE FROM events WHERE eventid = ?`;
  let sql5 = `DELETE FROM eventmembers WHERE eventid = ?`;
  const submit = req.body.submit;
  if(submit === "Edit") {
        db.query(sql, eventid, (err, eventResult) => {
            if (err) {
                console.log(err);
                throw err;
            }
            if (eventResult.length == 0) {
                res.render("selectevent", { data: userdata, error: 1 });
                return;
            }
            db.query(sql2, eventid, (err, eventMembersResult) => {
                if (err) {
                    console.log(err);
                    throw err;
                }
                db.query(sql3, [eventid, userid2], (err, memberDetailsResult) => {
                    if (err) {
                        console.log(err);
                        throw err;
                    }
                    console.log({
                        events: eventResult,
                        eventMembers: eventMembersResult,
                        memberDetails: memberDetailsResult,
                        data: userdata
                    });
                    res.render("editentry", {
                        events: eventResult,
                        eventMembers: eventMembersResult,
                        memberDetails: memberDetailsResult,
                        data: userdata
                    });
                });
            });
        });
  } else if(submit === "Delete") {
        // Delete associated event members first
        db.query(sql5, eventid, (err, result) => {
            if (err) {
                console.log(err);
                throw err;
            }
            // If event members were successfully deleted, proceed to delete the event
            db.query(sql4, eventid, (err, result) => {
                if (err) {
                    console.log(err);
                    throw err;
                }
                if (result.affectedRows === 0) {
                    res.render("selectevent", { data: userdata, error: 1 });
                } else {
                    res.render("main", { data: userdata });
                }
            });
        });
    } else {
    console.log("something's amiss...")
    res.render("editmember", {data: userdata, error: 1 });
  }
});

app.post("/editeventquery", (req, res) => {
  // pass user login data
  const { userid, username, name } = req.body;
  const userdata = { userid, username, name };
  console.log(userdata);
  let selectedPersons = req.body.person;
  console.log(selectedPersons);
  let eventname = req.body.eventname.trim();
  let eventdesc = req.body.description.trim();
  let eventimportance = req.body.importance.trim();
  let eventdatetime = req.body.time.trim();
  let eventid = req.body.eventid;
  console.log(eventid);
  let sql = `UPDATE events SET eventname = ?, eventdesc = ?, eventimportance = ?, eventdatetime = ? WHERE eventid = ?`;
  let sql2 = `DELETE FROM eventmembers WHERE eventid = ?`;
  let sql3 = `INSERT INTO eventmembers (eventid, memberid) VALUES ?`;
  let query = db.query(sql, [eventname, eventdesc, eventimportance, eventdatetime, eventid], (err, result) => {
      if (err) {
          console.log(err);
          throw err;
      }
      if (result.length == 0) {
          res.render("editentry", {data: userdata, error: 1 });
      } else {
          db.query(sql2, eventid, (err, rows) => {
              if (err) {
                  console.log(err);
                  throw err;
              }
              if (!selectedPersons) {
                  res.render("main", {data: userdata});
              } else {
                  if (!Array.isArray(selectedPersons)) {
                        selectedPersons = [selectedPersons];
                  }
                  if (selectedPersons != undefined){
                    const eventmembersData = selectedPersons.map(person => [eventid, parseInt(person)]);
                    db.query(sql3, [eventmembersData], (err, result) => {
                        if (err) {
                            console.log(err);
                            res.render("editentry", {data: userdata, error: 1 });
                        } else {
                            res.render("main", {data: userdata});
                        }
                    });
                  } else {
                    res.render("main", {data: userdata});
                  }
              }
          });
      }
  });
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

app.post("/addentry", (req, res) => {
   let id = req.body.userid.trim();
    let sql = `SELECT * FROM members WHERE userid = ?`;
    let query = db.query(sql, id, (err, result) => {
    if (err) {
      console.log(err);
      throw err;
    } else {
      const { userid, username, name } = req.body;
      const userdata = { userid, username, name };
      console.log(userdata);
      res.render("addentry", {members: result, data: userdata});
      }
  });
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

app.post("/selectentry", (req, res) => {
    let id = req.body.userid.trim();
    let sql = `SELECT * FROM events WHERE userid = ?`;
    let query = db.query(sql, id, (err, result) => {
    if (err) {
      console.log(err);
      throw err;
    } else {
      const { userid, username, name } = req.body;
      const userdata = { userid, username, name };
      console.log(userdata);
      res.render("selectentry", {events: result, data: userdata});
      }
  });
});

app.post("/logout", (req, res) => {
  res.render("index", {error: 0});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
