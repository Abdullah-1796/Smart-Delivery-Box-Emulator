import express from "express";
import pg from "pg";
import cors from "cors";
import bodyParser from "body-parser";

const port = 4002;
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
    host: "smartlocker.cdecc64m04m6.eu-north-1.rds.amazonaws.com",
    database: "smartLocker",
    password: "amazonwebservice123",
    port: 5432,
    ssl: { rejectUnauthorized: false },
    keepAlive: true
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
    const id = req.params.id;
    const str = `
        SELECT * FROM deliveryBox d 
        INNER JOIN compartment c ON d.lockerID = c.lockerID 
        WHERE d.lockerID = $1 
        ORDER BY compid
    `;

    db.query(str, [id], (err, data) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        if (data.rows.length === 0) {
            const query = `
                SELECT * FROM deliveryBox d 
                WHERE d.lockerID = $1
            `;
            db.query(query, [id], (err, data1) => {
                if (err) {
                    console.error("Database query error:", err);
                    return res.status(500).json({ error: "Internal server error" });
                }
                return res.json(data1);
            });
        } else {
            
            return res.json(data);
        }
    });
});


app.put("/Locker/Compartment/isLocked", (req, res) => {
    let lockerid = req.body.lockerid;
    let compid = req.body.compid;
    let islocked = req.body.islocked;

    const str = "update compartment set islocked = " + islocked + " where lockerid = " + lockerid + " and compid = " + compid;

    db.query(str, (err, data) => {
        if (err) {
            return res.json("Error");
        }
        return res.json("islocked updated");
    });
});

app.put("/Locker/Compartment/compstateid", (req, res) => {
    let lockerid = req.body.lockerid;
    let compid = req.body.compid;
    let compstateid = req.body.compstateid;

    const str = "update compartment set compstateid = " + compstateid + " where lockerid = " + lockerid + " and compid = " + compid;

    db.query(str, (err, data) => {
        if (err) {
            return res.json("Error");
        }
        return res.json("compstateid updated");
    });
});

app.put("/Locker/Compartment/otp", (req, res) => {
    let lockerid = req.body.lockerid;
    let compid = req.body.compid;
    let otp = req.body.otp;

    const str = "update compartment set otp = " + otp + " where lockerid = " + lockerid + " and compid = " + compid;

    db.query(str, (err, data) => {
        if (err) {
            return res.json("Error");
        }
        return res.json("OTP updated");
    });
});

