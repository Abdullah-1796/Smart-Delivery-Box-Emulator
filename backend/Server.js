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

app.put("/Locker/Compartment/parcelid", (req, res) => {
    let lockerid = req.body.lockerid;
    let compid = req.body.compid;
    let parcelid = req.body.parcelid;

    const str = "update compartment set parcelid = " + parcelid + " where lockerid = " + lockerid + " and compid = " + compid;

    db.query(str, (err, data) => {
        if (err) {
            return res.json("Error");
        }
        return res.json("Parcel ID updated");
    });
});

app.put("/Locker/Compartment/purpose", (req, res) => {
    let lockerid = req.body.lockerid;
    let compid = req.body.compid;
    let purpose = req.body.purpose;

    const str = "update compartment set purpose = '" + purpose + "' where lockerid = " + lockerid + " and compid = " + compid;

    db.query(str, (err, data) => {
        if (err) {
            return res.json("Error while updating purpose: " + err);
        }
        return res.json("Purpose updated");
    });
});

app.get("/", (req, res) => {
    const str = "select * from deliveryBox order by lockerId";

    db.query(str, (err, data) => {
        if(err)
        {
            return res.json("Error");
        }
        return res.json(data);
    });
});

app.get("/lockerWithOTP", async (req, res) => {
    const otp = req.query.otp;
    const lockerid = req.query.lockerid;
    console.log(otp, lockerid);
    const str = "select c.lockerid, c.compid, c.compstateid, c.compcategoryid, c.islocked, c.otp, c.parcelid, c.purpose, p.status from compartment c inner join (select status, parcelid from parcelForDelivery) as p on c.parcelid = p.parcelid where lockerid = '"+ lockerid +"' and otp = '"+ otp +"'";

    try {
        const result = await db.query(str);
        //console.log(result.rows);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({message: "Error while fetching locker against otp" + error});
    }
});

app.put("/placeParcelByRider", async (req, res) => {
    const parcelID = req.body.parcelID;

    //send SMS to receiver with new OTP to take parcel
})