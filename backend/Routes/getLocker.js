import express from 'express';
import db from "../database.js";
const router=express.Router();
router.get("/:id", (req, res) => {
    const id = req.params.id;
    // console.log(id);
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

export default router;