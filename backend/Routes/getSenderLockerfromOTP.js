import express from 'express';
import db from "../database.js";
const router=express.Router();
router.get("/", async (req, res) => {
    const otp = req.query.otp;
    const lockerid = req.query.lockerid;
    console.log(otp, lockerid);
    const str = "select c.lockerid, c.compid, c.compstateid, c.compcategoryid, c.islocked, c.otp, c.parcelid, c.purpose, p.status, p.stampid from compartment c inner join (select status, parcelid, stampid from SendParcel) as p on c.parcelid = p.parcelid where lockerid = '" + lockerid + "' and otp = '" + otp + "'";

    try {
        const result = await db.query(str);
        ////console.log(result.rows);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({ message: "Error while fetching locker against otp" + error });
    }
});

export default router;