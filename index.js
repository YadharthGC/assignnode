const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3002;
const mongodb = require("mongodb");
const mongoclient = mongodb.MongoClient;
const url =
  "mongodb+srv://ganesh:chitra@cluster0.2pjhw.mongodb.net/booking?retryWrites=true&w=majority";

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
/////////////////////////////////
////////////////////CREATE////////////////////////
///////////////STUDENT////////////
app.post("/student", async function (req, res) {
  try {
    let client = await mongoclient.connect(url);
    let db = client.db("assign");
    req.body.mentors = [];
    let post = await db.collection("students").insertOne(req.body);
    await client.close();
  } catch (error) {
    console.log("error1");
    console.log(error);
  }
});
//////////////MENTOR//////////////
app.post("/mentor", async function (req, res) {
  try {
    let client = await mongoclient.connect(url);
    let db = client.db("assign");
    req.body.students = [];
    let post = await db.collection("mentors").insertOne(req.body);
    await client.close();
  } catch (error) {
    console.log("error2");
    console.log(error);
  }
});
////////////////////////////
/////////////////////TABLE//////////////////
////////////////STUDENT////////////
app.get("/students", async function (req, res) {
  try {
    let client = await mongoclient.connect(url);
    let db = client.db("assign");
    let get = await db.collection("students").find({}).toArray();
    res.json(get);
    await client.close();
  } catch (error) {
    console.log("error3");
    console.log(error);
  }
});
//////////////MENTOR/////////////////////
app.get("/mentors", async function (req, res) {
  try {
    let client = await mongoclient.connect(url);
    let db = client.db("assign");
    let get = await db.collection("mentors").find({}).toArray();
    res.json(get);
    await client.close();
  } catch (error) {
    console.log("error4");
    console.log(error);
  }
});
////////////STUDENT WITH NO MENTOR/////////////////////
app.get("/studentn", async function (req, res) {
  try {
    let client = await mongoclient.connect(url);
    let db = client.db("assign");
    let get = await db
      .collection("students")
      .find({
        mentors: [],
      })
      .toArray();
    res.json(get);
    await client.close();
  } catch (error) {
    console.log("error33");
    console.log(error);
  }
});
////////////////////////////CHOOSE///////////////////////////
///////////////////BY STUDENT///////////////////
app.post("/id", async function (req, res) {
  try {
    console.log(req.body);
    let client = await mongoclient.connect(url);
    let db = client.db("assign");
    let get = await db
      .collection("students")
      .findOne({ _id: mongodb.ObjectId(req.body.did) });
    let post = await db.collection("students").findOneAndUpdate(
      {
        _id: mongodb.ObjectId(req.body.did),
      },
      {
        $push: {
          mentors: req.body.mentor,
        },
      }
    );
    let postb = await db.collection("mentors").findOneAndUpdate(
      {
        mentor: req.body.mentor,
      },
      {
        $push: {
          students: get.student,
        },
      }
    );
    await client.close();
  } catch (error) {
    console.log(error);
    console.log("error5");
  }
});
///////////////////BY MENTOR///////////////////
app.post("/select", async function main(req, res) {
  try {
    console.log(req.body);
    let client = await mongoclient.connect(url);
    let db = client.db("assign");
    let studenta = [],
      studentb = [];
    let n = -1,
      m = -1;
    let geta = await db.collection("students").find({}).toArray();
    for (i = 0; i < geta.length; i++) {
      n++;
      studenta[n] = geta[i].student;
    }
    console.log(studenta);
    let getb = await db
      .collection("mentors")
      .find({
        _id: mongodb.ObjectId(req.body.did),
      })
      .toArray();
    let j = getb[0].students;
    let x = j.length;
    for (i = 0; i < x; i++) {
      m++;
      studentb[m] = getb[0].students[i];
    }
    console.log(studentb);
    let final = [],
      k = -1;
    for (i = 0; i < studenta.length; i++) {
      for (j = 0; j < studentb.length; j++) {
        if (studenta[i] == studentb[j]) {
          studenta[i] = 0;
        }
      }
    }
    for (i = 0; i < studenta.length; i++) {
      if (studenta[i] != 0) {
        k++;
        final[k] = studenta[i];
      }
    }
    console.log(final);
    let total = { final };
    console.log(total);
    let del = await db.collection("current").deleteMany({});
    let post = await db.collection("current").insertOne(total);
    await client.close();
  } catch (error) {
    console.log(error);
    console.log("error45");
  }
});
app.get("/current", async function (req, res) {
  try {
    let client = await mongoclient.connect(url);
    let db = client.db("assign");
    let get = await db.collection("current").find({}).toArray();
    res.json(get);
    await client.close();
  } catch (error) {
    console.log("error7");
    console.log(error);
  }
});

app.post("/idb", async function (req, res) {
  try {
    console.log(req.body);
    let client = await mongoclient.connect(url);
    let db = client.db("assign");
    let get = await db
      .collection("mentors")
      .findOne({ _id: mongodb.ObjectId(req.body.did) });
    let post = await db.collection("mentors").findOneAndUpdate(
      {
        _id: mongodb.ObjectId(req.body.did),
      },
      {
        $push: {
          students: req.body.data,
        },
      }
    );
    let postb = await db.collection("students").findOneAndUpdate(
      {
        student: req.body.data,
      },
      {
        $push: {
          mentors: get.mentor,
        },
      }
    );
    await client.close();
  } catch (error) {
    console.log(error);
    console.log("error5");
  }
});

///////////////////////////////////////////
app.listen(port, function () {
  console.log(`App is Running in ${port}`);
});
