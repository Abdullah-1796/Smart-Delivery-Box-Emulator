import express from 'express';
import db from "../database.js";
const router=express.Router();
router.put("/", (req, res) => {
    let lockerid = req.body.lockerid;
    let compid = req.body.compid;
    let compstateid = req.body.compstateid;

    console.log(lockerid);

    const str = "update compartment set compstateid = " + compstateid + " where lockerid = " + lockerid + " and compid = " + compid;

    db.query(str, (err, data) => {
        if (err) {
            return res.json("Error");
        }
        return res.json("compstateid updated");
    });
});

export default router;