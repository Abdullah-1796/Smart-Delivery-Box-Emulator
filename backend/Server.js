import express from "express";
import pg from "pg";
import cors from "cors";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc"

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

const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Smart Locker API",
            version: "1.0.0",
            description: "API documentation for Smart Locker system",
        },
    },
    apis: ["./server.js"],
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));



/**
 * @swagger
 * /Locker/{id}:
 *   get:
 *     summary: Retrieve locker details by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Locker details retrieved successfully
 *       500:
 *         description: Internal server error
 */
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



/**
 * @swagger
 * /Locker/Compartment/isLocked:
 *   put:
 *     summary: Update compartment lock status
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lockerid:
 *                 type: integer
 *               compid:
 *                 type: integer
 *               islocked:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: isLocked updated
 *       500:
 *         description: Error updating status
 */
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


/**
 * @swagger
 * /Locker/Compartment/compstateid:
 *   put:
 *     summary: Update the state of a compartment
 *     tags:
 *       - Compartment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lockerid:
 *                 type: integer
 *                 example: 1
 *               compid:
 *                 type: integer
 *                 example: 101
 *               compstateid:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Compartment state updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Compartment state updated"
 *       400:
 *         description: Bad request (missing parameters)
 *       500:
 *         description: Internal server error
 */
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


/**
 * @swagger
 * /Locker/Compartment/otp:
 *   put:
 *     summary: Update OTP for a compartment
 *     tags:
 *       - Compartment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lockerid:
 *                 type: integer
 *                 example: 1
 *               compid:
 *                 type: integer
 *                 example: 101
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "OTP updated"
 *       400:
 *         description: Bad request (missing parameters)
 *       500:
 *         description: Internal server error
 */
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


/**
 * @swagger
 * /Locker/Compartment/parcelid:
 *   put:
 *     summary: Update parcel ID for a compartment
 *     tags:
 *       - Compartment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lockerid:
 *                 type: integer
 *                 example: 1
 *               compid:
 *                 type: integer
 *                 example: 101
 *               parcelid:
 *                 type: integer
 *                 example: 12345
 *     responses:
 *       200:
 *         description: Parcel ID updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Parcel ID updated"
 *       400:
 *         description: Bad request (missing parameters)
 *       500:
 *         description: Internal server error
 */
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


/**
 * @swagger
 * /Locker/Compartment/purpose:
 *   put:
 *     summary: Update purpose of a compartment (e.g., reserved, full, empty)
 *     tags:
 *       - Compartment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lockerid:
 *                 type: integer
 *                 example: 1
 *               compid:
 *                 type: integer
 *                 example: 101
 *               purpose:
 *                 type: string
 *                 example: reserved
 *     responses:
 *       200:
 *         description: Purpose updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Purpose updated"
 *       400:
 *         description: Bad request (missing parameters)
 *       500:
 *         description: Internal server error
 */
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


/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all delivery boxes detail
 *     tags: 
 *       - DeliveryBox
 *     responses:
 *       200:
 *         description: A list of delivery boxes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   lockerId:
 *                     type: integer
 *                   location:
 *                     type: string
 *                   status:
 *                     type: string
 *       500:
 *         description: Internal Server Error
 */
app.get("/", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM deliveryBox ORDER BY lockerId");
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Database query error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});


/**
 * @swagger
 * /lockerWithOTP:
 *   get:
 *     summary: Open locker using OTP
 *     tags:
 *       - Locker
 *     parameters:
 *       - in: query
 *         name: otp
 *         schema:
 *           type: string
 *         required: true
 *         description: The OTP to open the locker
 *       - in: query
 *         name: lockerid
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the locker
 *     responses:
 *       200:
 *         description: Successfully fetched locker details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   lockerid:
 *                     type: integer
 *                   compid:
 *                     type: integer
 *                   compstateid:
 *                     type: integer
 *                   compcategoryid:
 *                     type: integer
 *                   islocked:
 *                     type: boolean
 *                   otp:
 *                     type: string
 *                   parcelid:
 *                     type: integer
 *                   purpose:
 *                     type: string
 *                   status:
 *                     type: string
 *                   stampid:
 *                     type: integer
 *       400:
 *         description: Missing required query parameters
 *       500:
 *         description: Internal server error
 */

app.get("/lockerWithOTP", async (req, res) => {
    const otp = req.query.otp;
    const lockerid = req.query.lockerid;
    console.log(otp, lockerid);
    const str = "select c.lockerid, c.compid, c.compstateid, c.compcategoryid, c.islocked, c.otp, c.parcelid, c.purpose, p.status, p.stampid from compartment c inner join (select status, parcelid, stampid from parcelForDelivery) as p on c.parcelid = p.parcelid where lockerid = '"+ lockerid +"' and otp = '"+ otp +"'";

    try {
        const result = await db.query(str);
        //console.log(result.rows);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({message: "Error while fetching locker against otp" + error});
    }
});


/**
 * @swagger
 * /placeParcelByRider:
 *   get:
 *     summary: send SMS to receiver with new OTP to take parcel
 */
app.put("/placeParcelByRider", async (req, res) => {
    const parcelID = req.body.parcelID;

    //send SMS to receiver with new OTP to take parcel
})

app.get("/SenderlockerWithOTP", async (req, res) => {
    const otp = req.query.otp;
    const lockerid = req.query.lockerid;
    console.log(otp, lockerid);
    const str = "select c.lockerid, c.compid, c.compstateid, c.compcategoryid, c.islocked, c.otp, c.parcelid, c.purpose, p.status, p.stampid from compartment c inner join (select status, parcelid, stampid from SendParcel) as p on c.parcelid = p.parcelid where lockerid = '"+ lockerid +"' and otp = '"+ otp +"'";

    try {
        const result = await db.query(str);
        //console.log(result.rows);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({message: "Error while fetching locker against otp" + error});
    }
});