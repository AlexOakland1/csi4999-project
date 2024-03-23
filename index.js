const express = require("express");
const ejs = require("ejs");
const mysql = require("mysql");

// Create express app
const app = express();

// define db parameters
const db = mysql.createConnection({
  host: "127.0.0.1",
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

//calendar code

//generate calendar dates
function calendar(month, year) {
    const lastday = new Date(year, month + 1, 0).getDate();
    const firstday = new Date(year, month, 1).getDay();
    const cal = [];
    let counter = 1;

    for (let i = 0; i < 6; i++) {
        const week = [];
        for (let j = 0; j < 7; j++) {
            if ((i === 0 && j < firstday) || counter > lastday) {
                week.push(null);
            } else {
                week.push(new Date(year, month, counter++));
            }
        }
        cal.push(week);
        if (counter > lastday) break;
    }

    return cal;
}

const month = new Date().getMonth();
const year = new Date().getFullYear();
let calendarData = calendar(month, year);

//query routes
app.post("/createaccount", (req, res) => {
  let data = { username: req.body.username.trim(), password: req.body.password.trim(), name: req.body.realname.trim() };
  let pass = req.body.password.trim();
  let sql = `INSERT INTO users SET ?`;
  let query = db.query(sql, data, (err, result) => {
    if (err) {
        console.log(err);
        res.render("createacc", { error: 1 });
    } else {
      let subuserSql = `INSERT INTO subusers (userid, subuserid, username, status) VALUES (?, '0', ?, 'Adult')`;
      let subuserData = [result.insertId, req.body.username.trim()];
      db.query(subuserSql, subuserData, (err, subuserResult) => {
        if (err) {
          console.log(err);
          res.render("createacc", { error: 1 });
        } else {
          let subuserId = subuserResult.insertId;
          let userSubuserSql = `INSERT INTO usersubusers (userid, subuserid) VALUES (?, ?)`;
          let userSubuserData = [result.insertId, subuserId];
          db.query(userSubuserSql, userSubuserData, (err, userSubuserResult) => {
            if (err) {
              console.log(err);
              res.render("createacc", { error: 1 });
            } else {
              const selectSubusers = `SELECT * FROM subusers WHERE subuserid IN (SELECT subuserid FROM usersubusers WHERE userid = ?)`;
              db.query(selectSubusers, result.insertId, (err, subusersData) => {
                if (err) {
                  console.log(err);
                  res.render("createacc", { error: 1 });
                } else {
                  const selectName = `SELECT userid, username, name FROM users WHERE password = ?`;
                  const selectEvents = `SELECT * FROM events WHERE userid = ?`;
                  const selectMembers = `SELECT * FROM members WHERE userid = ?`;
                  db.query(selectName, pass, (err, userdata) => {
                    db.query(selectEvents, userdata[0].userid, (err, eventlist) => {
                      db.query(selectMembers, userdata[0].userid, (err, memberlist) => {
                        res.render("subuser", {data: userdata[0], events: eventlist, members: memberlist, fullevents: eventlist, subusers: subusersData});
                      });
                    });
                  });
                }
              });
            }
          });
        }
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
      const selectSubusers = `SELECT * FROM subusers WHERE subuserid IN (SELECT subuserid FROM usersubusers WHERE userid = ?)`;
      const selectEvents = `SELECT * FROM events WHERE userid = ?`;
      const selectMembers = `SELECT * FROM members WHERE userid = ?`;
      db.query(selectName, pass, (err, userdata) => {
        db.query(selectEvents, userdata[0].userid, (err, eventlist) => {
          db.query(selectMembers, userdata[0].userid, (err, memberlist) => {
            db.query(selectSubusers, userdata[0].userid, (err, subusersData) => {
              res.render("subuser", {data: userdata[0], events: eventlist, members: memberlist, fullevents: eventlist, subusers: subusersData});
            });
          });
        });
      });
    }
  });
});

app.post("/subuserlogin", (req, res) => {
  const { userid, username, name } = req.body;
  const userdata = { userid, username, name };
  const submit = req.body.submit;
  const subuserid = req.body.subuserval.trim();

  if (submit === "Select User") {
    const sql = `SELECT * FROM subusers WHERE subuserid = ?`;
    const selectEvents = `SELECT * FROM events WHERE userid = ?`;
    const selectMembers = `SELECT * FROM members WHERE userid = ?`;

    db.query(sql, subuserid, (err, result) => {
      if (err) {
        console.log(err);
        throw err;
      } else {
        db.query(selectEvents, userid, (err, eventlist) => {
          db.query(selectMembers, userid, (err, memberlist) => {
            console.log(result[0]);
            console.log(userdata, eventlist, memberlist);
            res.render("main", { data: userdata, events: eventlist, members: memberlist, fullevents: eventlist, subuser: result[0], calendarData: calendarData});
          });
        });
      }
    });
  } else if (submit === "Edit User") {
    const sql = `SELECT * FROM subusers WHERE subuserid = ?`;
    db.query(sql, subuserid, (err, result) => {
      if (err) {
        console.log(err);
        throw err;
      } else {
        res.render("editsubuser", { data: userdata, subuser: result[0] });
      }
    });
  } else if (submit === "Delete User") {
    const sql = `SELECT * FROM subusers WHERE userid = ?`;
    const sql2 = `DELETE FROM usersubusers WHERE subuserid = ?`;
    const sql3 = `DELETE FROM subusers WHERE subuserid = ?`;

    db.query(sql2, subuserid, (err, del) => {
      if (err) {
        console.log(err);
        throw err;
      } else {
        db.query(sql3, subuserid, (err, del2) => {
          if (err) {
            console.log(err);
            throw err;
          } else {
            db.query(sql, userid, (err, result) => {
              if (err) {
                console.log(err);
                throw err;
              } else {
                console.log(result);
                res.render("subuser", { data: userdata, subusers: result });
              }
            });
          }
        });
      }
    });
  }
});

app.post("/addsubuserquery", (req, res) => {
  const { userid, username, name } = req.body;
  const userdata = { userid, username, name };
  const submit = req.body.submit;
  const subusername = req.body.addname.trim();
  const subusercat = req.body.addcategory.trim();

  if (submit === "Add User") {
    let subuserSql = `INSERT INTO subusers (userid, subuserid, subusername, subusertype) VALUES (?, 0, ?, ?)`;
    let subuserData = [userid, subusername, subusercat];

    db.query(subuserSql, subuserData, (err, subuserResult) => {
      if (err) {
        console.log(err);
        res.render("addsubuser", { error: 1 });
      } else {
        let subuserId = subuserResult.insertId;
        let userSubuserSql = `INSERT INTO usersubusers (userid, subuserid) VALUES (?, ?)`;
        let userSubuserData = [userid, subuserId];

        db.query(userSubuserSql, userSubuserData, (err, userSubuserResult) => {
          if (err) {
            console.log(err);
            res.render("addsubuser", { error: 1 });
          } else {
            const sql = `SELECT * FROM subusers WHERE userid = ?`;
            db.query(sql, userid, (err, result) => {
              if (err) {
                console.log(err);
                throw err;
              } else {
                res.render("subuser", { data: userdata, subusers: result });
              }
            });
          }
        });
      }
    });
  } else {
    const sql = `SELECT * FROM subusers WHERE userid = ?`;
    db.query(sql, userid, (err, result) => {
      if (err) {
        console.log(err);
        throw err;
      } else {
        res.render("subuser", { data: userdata, subusers: result });
      }
    });
  }
});

app.post("/editsubuserquery", (req, res) => {
  const { userid, username, name } = req.body;
  const userdata = { userid, username, name };
  const subuserid = req.body.subuserid;
  const submit = req.body.submit;
  const subusername = req.body.editname.trim();
  const subusercat = req.body.editcategory.trim();

  if (submit === "Edit User") {
    let subuserSql = `UPDATE subusers SET subusername = ?, subusertype = ? WHERE subuserid = ?`;
    let subuserData = [subusername, subusercat, subuserid];

    db.query(subuserSql, subuserData, (err, subuserResult) => {
      if (err) {
        console.log(err);
        res.render("addsubuser", { error: 1 });
      } else {
        const sql = `SELECT * FROM subusers WHERE userid = ?`;
            db.query(sql, userid, (err, result) => {
              if (err) {
                console.log(err);
                throw err;
              } else {
                res.render("subuser", { data: userdata, subusers: result });
              }
            });
      }
    });
  } else {
    const sql = `SELECT * FROM subusers WHERE userid = ?`;
    db.query(sql, userid, (err, result) => {
      if (err) {
        console.log(err);
        throw err;
      } else {
        res.render("subuser", { data: userdata, subusers: result });
      }
    });
  }
});

app.post("/changeuser", (req, res) => {
  const { userid, username, name } = req.body;
  const userdata = { userid, username, name };
  const eventlist = req.body.events;
  const memberlist = req.body.members;
  const sql = `SELECT * FROM subusers WHERE userid = ?`
    let query = db.query(sql, userid, (err, result) => {
      if (err) {
        console.log(err);
        throw err;
      } else {
        res.render("subuser", {data: userdata, events: eventlist, members: memberlist, fullevents: eventlist, subusers: result});
      }
    });
});

app.post("/addmemberquery", (req, res) => {
  // pass user login data
  const { userid, username, name } = req.body;
  const userdata = { userid, username, name };
  console.log(userdata);
  const eventlist = req.body.events;
  const memberlist = req.body.members;
  const { subuserid, subusername, subusertype } = req.body;
    const sub = { subuserid, subusername, subusertype };
  let addmemberdata = { memberid: "0", userid: req.body.userid.trim(), membername: req.body.addname.trim(), membercategory: req.body.addcategory.trim() };
  let sql = `INSERT INTO members SET ?`;
  const selectEvents = `SELECT * FROM events WHERE userid = ?`;
  const selectMembers = `SELECT * FROM members WHERE userid = ?`;
  let query = db.query(sql, addmemberdata, (err, result) => {
    if (err) {
      console.log(err);
      throw err;
    }
    if (result.length == 0) {
      res.render("addmember", {data: userdata, error: 1 });
    } else {
      db.query(selectEvents, userdata.userid, (err, eventlist) => {
        db.query(selectMembers, userdata.userid, (err, memberlist) => {
          res.render("main", {data: userdata, events: eventlist, members: memberlist, fullevents: eventlist, subuser: sub, calendarData: calendarData});
        });
      });
    }
  });
});

app.post("/addeventquery", (req, res) => {
  // pass user login data
  const { userid, username, name } = req.body;
  const userdata = { userid, username, name };
  console.log(userdata);
  const { subuserid, subusername, subusertype } = req.body;
    const sub = { subuserid, subusername, subusertype };
  let selectedPersons = req.body.person;
  console.log(selectedPersons);
  let addeventdata = { eventname: req.body.eventname.trim(), eventdesc: req.body.description.trim(), eventdatetime: req.body.time.trim(), eventimportance: req.body.importance.trim(), userid: req.body.userid.trim(), location: req.body.location.trim() };
  let geteventdata = { eventname: req.body.eventname.trim(), eventdesc: req.body.description.trim(), eventdatetime: req.body.time.trim(), eventimportance: req.body.importance.trim(), userid: req.body.userid.trim(), location: req.body.location.trim() };
  let sql = `INSERT INTO events SET ?`;
  let sql2 = `SELECT eventid FROM events WHERE eventname = ? AND eventdesc = ? AND eventdatetime = ? AND eventimportance = ? AND userid = ? AND location = ?`;
  let sql3 = `INSERT INTO eventmembers (eventid, memberid) VALUES ?`;
  const selectEvents = `SELECT * FROM events WHERE userid = ?`;
  const selectMembers = `SELECT * FROM members WHERE userid = ?`;
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
                  db.query(selectEvents, userdata.userid, (err, eventlist) => {
                    db.query(selectMembers, userdata.userid, (err, memberlist) => {
                      res.render("main", {data: userdata, events: eventlist, members: memberlist, fullevents: eventlist, subuser: sub, calendarData: calendarData});
                    });
                  });
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
                          db.query(selectEvents, userdata.userid, (err, eventlist) => {
                            db.query(selectMembers, userdata.userid, (err, memberlist) => {
                              res.render("main", {data: userdata, events: eventlist, members: memberlist, fullevents: eventlist, subuser: sub, calendarData: calendarData});
                            });
                          });
                        }
                    });
                  } else {
                    db.query(selectEvents, userdata.userid, (err, eventlist) => {
                      db.query(selectMembers, userdata.userid, (err, memberlist) => {
                        res.render("main", {data: userdata, events: eventlist, members: memberlist, fullevents: eventlist, subuser: sub, calendarData: calendarData});
                      });
                    });
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
  const { subuserid, subusername, subusertype } = req.body;
    const sub = { subuserid, subusername, subusertype };
  const selectEvents = `SELECT * FROM events WHERE userid = ?`;
  const selectMembers = `SELECT * FROM members WHERE userid = ?`;
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
        db.query(selectEvents, userdata.userid, (err, eventlist) => {
          db.query(selectMembers, userdata.userid, (err, memberlist) => {
            res.render("main", {data: userdata, events: eventlist, members: memberlist, fullevents: eventlist, subuser: sub, calendarData: calendarData});
          });
        });
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
        db.query(selectEvents, userdata.userid, (err, eventlist) => {
          db.query(selectMembers, userdata.userid, (err, memberlist) => {
            res.render("main", {data: userdata, events: eventlist, members: memberlist, fullevents: eventlist, subuser: sub, calendarData: calendarData});
          });
        });
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
  const { subuserid, subusername, subusertype } = req.body;
    const sub = { subuserid, subusername, subusertype };
  let eventid = req.body.editid.trim();
  let userid2 = req.body.userid.trim();
  let sql = `SELECT * FROM events WHERE eventid = ?`;
  let sql2 = `SELECT * FROM eventmembers WHERE eventid = ?`;
  let sql3 = `SELECT * FROM members WHERE userid IN (SELECT userid FROM eventmembers WHERE eventid = ?) AND userid = ?`;
  let sql4 = `DELETE FROM events WHERE eventid = ?`;
  let sql5 = `DELETE FROM eventmembers WHERE eventid = ?`;
  let sql6 = `SELECT * FROM members WHERE userid = ?`;
  const selectEvents = `SELECT * FROM events WHERE userid = ?`;
  const selectMembers = `SELECT * FROM members WHERE userid = ?`;
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
                    db.query(sql6, userid2, (err, allMembersResult) => {
                    if (err) {
                        console.log(err);
                        throw err;
                    }
                      console.log({
                          allMembers: allMembersResult,
                          events: eventResult,
                          eventMembers: eventMembersResult,
                          memberDetails: memberDetailsResult,
                          data: userdata,
                          subuser: sub
                      });
                      res.render("editentry", {
                          allMembers: allMembersResult,
                          events: eventResult,
                          eventMembers: eventMembersResult,
                          memberDetails: memberDetailsResult,
                          data: userdata,
                          subuser: sub
                      });
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
                    db.query(selectEvents, userdata.userid, (err, eventlist) => {
                      db.query(selectMembers, userdata.userid, (err, memberlist) => {
                        res.render("main", {data: userdata, events: eventlist, members: memberlist, fullevents: eventlist, subuser: sub, calendarData: calendarData});
                      });
                    });
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
  const { subuserid, subusername, subusertype } = req.body;
    const sub = { subuserid, subusername, subusertype };
  let selectedPersons = req.body.person;
  console.log(selectedPersons);
  let eventname = req.body.eventname.trim();
  let eventdesc = req.body.description.trim();
  let eventimportance = req.body.importance.trim();
  let eventdatetime = req.body.time.trim();
  let location = req.body.location.trim();
  let eventid = req.body.eventid;
  console.log(eventid);
  let sql = `UPDATE events SET eventname = ?, eventdesc = ?, eventimportance = ?, eventdatetime = ?, location = ? WHERE eventid = ?`;
  let sql2 = `DELETE FROM eventmembers WHERE eventid = ?`;
  let sql3 = `INSERT INTO eventmembers (eventid, memberid) VALUES ?`;
  const selectEvents = `SELECT * FROM events WHERE userid = ?`;
  const selectMembers = `SELECT * FROM members WHERE userid = ?`;
  let query = db.query(sql, [eventname, eventdesc, eventimportance, eventdatetime, location, eventid], (err, result) => {
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
                  db.query(selectEvents, userdata.userid, (err, eventlist) => {
                    db.query(selectMembers, userdata.userid, (err, memberlist) => {
                      res.render("main", {data: userdata, events: eventlist, members: memberlist, fullevents: eventlist, subuser: sub, calendarData: calendarData});
                    });
                  });
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
                            db.query(selectEvents, userdata.userid, (err, eventlist) => {
                              db.query(selectMembers, userdata.userid, (err, memberlist) => {
                                res.render("main", {data: userdata, events: eventlist, members: memberlist, fullevents: eventlist, subuser: sub, calendarData: calendarData});
                              });
                            });
                        }
                    });
                  } else {
                    db.query(selectEvents, userdata.userid, (err, eventlist) => {
                      db.query(selectMembers, userdata.userid, (err, memberlist) => {
                        res.render("main", {data: userdata, events: eventlist, members: memberlist, fullevents: eventlist, subuser: sub, calendarData: calendarData});
                      });
                    });
                  }
              }
          });
      }
  });
});

app.post("/filtermembers", (req, res) => {
    const { userid, username, name } = req.body;
    const userdata = { userid, username, name };
    console.log(userdata);
    const { subuserid, subusername, subusertype } = req.body;
    const sub = { subuserid, subusername, subusertype };
    const selectEvents = `SELECT * FROM events WHERE userid = ?`;
    const selectMembers = `SELECT * FROM members WHERE userid = ?`;
    const selectFilter = `SELECT * FROM events WHERE eventid IN (SELECT eventid FROM eventmembers WHERE memberid = ?) AND userid = ?`;
    let memberid = req.body.memberid.trim();
    console.log(memberid);
    if (memberid === "null") {
      db.query(selectEvents, userdata.userid, (err, eventlist) => {
        db.query(selectMembers, userdata.userid, (err, memberlist) => {
          console.log(eventlist);
          res.render("main", {data: userdata, events: eventlist, members: memberlist, fullevents: eventlist, subuser: sub, calendarData: calendarData});
        });
      });
    } else {
      db.query(selectFilter, [memberid, userdata.userid], (err, eventlistfiltered) => {
        if (err) { console.log(err); }
        db.query(selectEvents, userdata.userid, (err, eventlist) => {
          db.query(selectMembers, userdata.userid, (err, memberlist) => {
            console.log(eventlist);
            res.render("main", {data: userdata, events: eventlistfiltered, members: memberlist, fullevents: eventlist, subuser: sub, calendarData: calendarData});
          });
        });
      });
    }
});

app.post("/filterlocations", (req, res) => {
    const { userid, username, name } = req.body;
    const userdata = { userid, username, name };
    console.log(userdata);
    const { subuserid, subusername, subusertype } = req.body;
    const sub = { subuserid, subusername, subusertype };
    const selectEvents = `SELECT * FROM events WHERE userid = ?`;
    const selectMembers = `SELECT * FROM members WHERE userid = ?`;
    const selectFilter = `SELECT * FROM events WHERE userid = ? AND location = ?`;
    let location = req.body.location.trim();
    console.log(location);
    if (location === "null") {
      db.query(selectEvents, userdata.userid, (err, eventlist) => {
        db.query(selectMembers, userdata.userid, (err, memberlist) => {
          console.log(eventlist);
          res.render("main", {data: userdata, events: eventlist, members: memberlist, fullevents: eventlist, subuser: sub, calendarData: calendarData});
        });
      });
    } else {
      db.query(selectFilter, [userdata.userid, location], (err, eventlistfiltered) => {
        if (err) { console.log(err); }
        db.query(selectEvents, userdata.userid, (err, eventlist) => {
          db.query(selectMembers, userdata.userid, (err, memberlist) => {
            console.log(eventlist);
            res.render("main", {data: userdata, events: eventlistfiltered, members: memberlist, fullevents: eventlist, subuser: sub, calendarData: calendarData});
          });
        });
      });
    }
});

app.post("/sorttime", (req, res) => {
    const { userid, username, name } = req.body;
    const userdata = { userid, username, name };
    console.log(userdata);
    const { subuserid, subusername, subusertype } = req.body;
    const sub = { subuserid, subusername, subusertype };
    const selectEvents = `SELECT * FROM events WHERE userid = ?`;
    const selectMembers = `SELECT * FROM members WHERE userid = ?`;
    const selectFilter = `SELECT * FROM events WHERE userid = ? ORDER BY eventdatetime`;
    db.query(selectFilter, userdata.userid, (err, eventlistfiltered) => {
      if (err) { console.log(err); }
      db.query(selectEvents, userdata.userid, (err, eventlist) => {
        db.query(selectMembers, userdata.userid, (err, memberlist) => {
          console.log(eventlist);
          res.render("main", {data: userdata, events: eventlistfiltered, members: memberlist, fullevents: eventlist, subuser: sub, calendarData: calendarData});
        });
      });
    });
});

app.post("/sortimportance", (req, res) => {
    const { userid, username, name } = req.body;
    const userdata = { userid, username, name };
    console.log(userdata);
    const { subuserid, subusername, subusertype } = req.body;
    const sub = { subuserid, subusername, subusertype };
    const selectEvents = `SELECT * FROM events WHERE userid = ?`;
    const selectMembers = `SELECT * FROM members WHERE userid = ?`;
    const selectFilter = `SELECT * FROM events WHERE userid = ? ORDER BY FIELD(eventimportance, 'important','normal','low')`;
    db.query(selectFilter, userdata.userid, (err, eventlistfiltered) => {
      if (err) { console.log(err); }
      db.query(selectEvents, userdata.userid, (err, eventlist) => {
        db.query(selectMembers, userdata.userid, (err, memberlist) => {
          console.log(eventlist);
          res.render("main", {data: userdata, events: eventlistfiltered, members: memberlist, fullevents: eventlist, subuser: sub, calendarData: calendarData});
        });
      });
    });
});

// routes for displaying more pages
app.post("/main", (req, res) => {
    const { userid, username, name } = req.body;
    const userdata = { userid, username, name };
    console.log(userdata);
    const { subuserid, subusername, subusertype } = req.body;
    const sub = { subuserid, subusername, subusertype };
    console.log(sub);
    const selectEvents = `SELECT * FROM events WHERE userid = ?`;
    const selectMembers = `SELECT * FROM members WHERE userid = ?`;
    db.query(selectEvents, userdata.userid, (err, eventlist) => {
      db.query(selectMembers, userdata.userid, (err, memberlist) => {
        res.render("main", {data: userdata, events: eventlist, members: memberlist, fullevents: eventlist, subuser: sub, calendarData: calendarData});
      });
    });
});

app.post("/addmember", (req, res) => {
    const { userid, username, name } = req.body;
    const userdata = { userid, username, name };
    console.log(userdata);
    const { subuserid, subusername, subusertype } = req.body;
    const sub = { subuserid, subusername, subusertype };
    console.log(sub);
    res.render("addmember", {data: userdata, subuser: sub});
});

app.post("/addentry", (req, res) => {
    let id = req.body.userid.trim();
    let sql = `SELECT * FROM members WHERE userid = ?`;
    const { subuserid, subusername, subusertype } = req.body;
    const sub = { subuserid, subusername, subusertype };
    let query = db.query(sql, id, (err, result) => {
    if (err) {
      console.log(err);
      throw err;
    } else {
      const { userid, username, name } = req.body;
      const userdata = { userid, username, name };
      console.log(userdata);
      res.render("addentry", {members: result, data: userdata, subuser: sub});
      }
  });
});

app.post("/editmember", (req, res) => {
    let id = req.body.userid.trim();
    let sql = `SELECT * FROM members WHERE userid = ?`;
    const { subuserid, subusername, subusertype } = req.body;
    const sub = { subuserid, subusername, subusertype };
    let query = db.query(sql, id, (err, result) => {
    if (err) {
      console.log(err);
      throw err;
    } else {
      // pass user login data
      const { userid, username, name } = req.body;
      const userdata = { userid, username, name };
      console.log(result);
      res.render("editmember", {members: result, data: userdata, subuser: sub});
    }
  });
});

app.post("/selectentry", (req, res) => {
    let id = req.body.userid.trim();
    let sql = `SELECT * FROM events WHERE userid = ?`;
    const { subuserid, subusername, subusertype } = req.body;
    const sub = { subuserid, subusername, subusertype };
    let query = db.query(sql, id, (err, result) => {
    if (err) {
      console.log(err);
      throw err;
    } else {
      const { userid, username, name } = req.body;
      const userdata = { userid, username, name };
      console.log(userdata);
      res.render("selectentry", {events: result, data: userdata, subuser: sub});
      }
  });
});

app.post("/addsubuser", (req, res) => {
    const { userid, username, name } = req.body;
    const userdata = { userid, username, name };
    console.log(userdata);
    const sub = JSON.parse(req.body.subusers);
    console.log(sub);
    res.render("addsubuser", {data: userdata, subuser: sub});
});

app.post("/prevmonth", (req, res) => {
    let events = JSON.parse(req.body.events);
    console.log(events);
    events.forEach(event => {
      event.eventdatetime = new Date(event.eventdatetime);
    });
    console.log(JSON.parse(req.body.events)[0].eventdatetime);
    let year = parseInt(req.body.year) + 1900 ;
    console.log(year);
    let month = parseInt(req.body.month) - 1;
    console.log(month);
    if (month === -1) {
      month = 11;
      year--;
    }
    let newcal = calendar(month, year)
    res.render("main", {data: JSON.parse(req.body.data), events: events, members: JSON.parse(req.body.members), fullevents: JSON.parse(req.body.events), subuser: JSON.parse(req.body.subuser), calendarData: newcal})
});

app.post("/nextmonth", (req, res) => {
    let events = JSON.parse(req.body.events);
    console.log(events);
    events.forEach(event => {
      event.eventdatetime = new Date(event.eventdatetime);
    });
    console.log(JSON.parse(req.body.events)[0].eventdatetime);
    let year = parseInt(req.body.year) + 1900 ;
    console.log(year);
    let month = parseInt(req.body.month) + 1;
    console.log(month);
    if (month === 12) {
      month = 0;
      year++;
    }
    let newcal = calendar(month, year)
    res.render("main", {data: JSON.parse(req.body.data), events: events, members: JSON.parse(req.body.members), fullevents: JSON.parse(req.body.events), subuser: JSON.parse(req.body.subuser), calendarData: newcal})
});

app.post("/logout", (req, res) => {
  res.render("index", {error: 0});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
