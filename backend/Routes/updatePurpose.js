import express from 'express';
import db from "../database.js";
const router=express.Router();
router.put("/", (req, res) => {
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

router.get("/", (req, res) => {
    const { lockerid, otp } = req.body;

    const str = "SELECT purpose FROM compartment WHERE lockerid = $1 AND otp = $2";

    db.query(str, [lockerid, otp], (err, data) => {
        if (err) {
            console.error("Error while getting purpose:", err);
            return res.status(500).json({ error: "Error while getting purpose" });
        }
        res.status(200).json(data.rows); // or data.rows[0] if you're expecting one result
    });
});

export default router;