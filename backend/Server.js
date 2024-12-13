import express from "express";
import pg from "pg";
import cors from "cors";
import bodyParser from "body-parser";

const port = 3001;
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
/*
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "test"
});*/

const db = new pg.Client({
	user: "postgres",
	host: "localhost",
	database: "smartLocker",
	password: "12345678",
	port: 5432,
});

db.connect((err) => {
    if (err) {
    console.error('Error connecting to postgres database: ');
    return;
    }
    console.log('Connected to postgres database');
});

app.listen(port, () => {
  console.log(`Server is listening from port ${port}.`);
});

app.get("/Locker/:id", (req, res) => {
    let id = req.params.id;
    const str = "select * from deliveryBox d inner join compartment c on d.lockerID = c.lockerID where d.lockerID = " + id + " order by compid";

    db.query(str, (err, data) => {
        if(err)
        {
            return res.json("Error");
        }
        console.log(data);
        return res.json(data);
    });
});

app.put("/Locker/Compartment/isLocked", (req, res) => {
    let lockerid = req.body.lockerid;
    let compid = req.body.compid;
    let islocked = req.body.islocked;

    const str = "update compartment set islocked = " + islocked +" where lockerid = " + lockerid + " and compid = " + compid;

    db.query(str, (err, data) => {
        if(err)
        {
            return res.json("Error");
        }
        return res.json("islocked updated");
    });
});

app.put("/Locker/Compartment/compstateid", (req, res) => {
    let lockerid = req.body.lockerid;
    let compid = req.body.compid;
    let compstateid = req.body.compstateid;

    const str = "update compartment set compstateid = " + compstateid +" where lockerid = " + lockerid + " and compid = " + compid;

    db.query(str, (err, data) => {
        if(err)
        {
            return res.json("Error");
        }
        return res.json("compstateid updated");
    });
});

app.put("/Locker/Compartment/otp", (req, res) => {
    let lockerid = req.body.lockerid;
    let compid = req.body.compid;
    let otp = req.body.otp;

    const str = "update compartment set otp = " + otp +" where lockerid = " + lockerid + " and compid = " + compid;

    db.query(str, (err, data) => {
        if(err)
        {
            return res.json("Error");
        }
        return res.json("OTP updated");
    });
});

app.get("/", (req, res) => {
    const str = "Select * from deliveryBox";

    db.query(str, (err, data) => {
        if(err)
        {
            return res.json("Error");
        }
        return res.json(data);
    });
});