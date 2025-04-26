import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc"
import getLocker from "./Routes/getLocker.js";
import isLocked from "./Routes/updateLockerLockedState.js"
import compstate from "./Routes/updatecompstateid.js"
import otp from "./Routes/updateOTP.js"
import parcelID from "./Routes/updateParcelId.js"
import purpose from "./Routes/updatePurpose.js"
import receivingLocker from "./Routes/getReceiverLockerfromOTP.js"
import sendingLocker from "./Routes/getSenderLockerfromOTP.js"
import db from "./database.js" 
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
// app.get("/Locker/:id", (req, res) => {
//     const id = req.params.id;
//     const str = `
//         SELECT * FROM deliveryBox d 
//         INNER JOIN compartment c ON d.lockerID = c.lockerID 
//         WHERE d.lockerID = $1 
//         ORDER BY compid
//     `;

//     db.query(str, [id], (err, data) => {
//         if (err) {
//             console.error("Database query error:", err);
//             return res.status(500).json({ error: "Internal server error" });
//         }
//         if (data.rows.length === 0) {
//             const query = `
//                 SELECT * FROM deliveryBox d 
//                 WHERE d.lockerID = $1
//             `;
//             db.query(query, [id], (err, data1) => {
//                 if (err) {
//                     console.error("Database query error:", err);
//                     return res.status(500).json({ error: "Internal server error" });
//                 }
//                 return res.json(data1);
//             });
//         } else {

//             return res.json(data);
//         }
//     });
// });

app.use("/Locker", getLocker);

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
app.use("/Locker/Compartment/isLocked", isLocked);


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
app.put("/Locker/Compartment/compstateid", compstate);


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
app.put("/Locker/Compartment/otp", otp);


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
app.put("/Locker/Compartment/parcelid", parcelID);


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
app.put("/Locker/Compartment/purpose", purpose);


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

app.get("/lockerWithOTP", receivingLocker);


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

app.get("/SenderlockerWithOTP", sendingLocker);