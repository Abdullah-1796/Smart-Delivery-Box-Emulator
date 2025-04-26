import express from 'express';
import db from "../database.js";
const router=express.Router();
router.put("/", (req, res) => {
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

export default router;