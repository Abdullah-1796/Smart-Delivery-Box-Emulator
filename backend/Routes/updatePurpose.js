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

export default router;