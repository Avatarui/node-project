import express from "express";
import {conn, mysql} from "../dbconnect";
import { imgvote } from "../model/imgvote";
export const router = express.Router();

router.get("/", (req, res) => {
    conn.query('select * from vote', (err, result, fields)=>{
        if (result && result.length > 0) {
            // ส่ง response กลับด้วยข้อมูลผู้ใช้
            res.json(result);
        } else {
            // ถ้าไม่พบผู้ใช้, ส่ง response กลับเป็น { success: false }
            res.json({
                success: false,
            });
        }
    });
  });

router.post("/insertimg",(req,res)=>{
     let imgtovotes : imgvote = req.body;
     let sql = "INSERT INTO `vote`(`uid`, `picture_id`, `point`,`isWinner`) VALUES (?,?,?,?)";
     sql = mysql.format(sql,[
        imgtovotes.uid,
        imgtovotes.picture_id,
        imgtovotes.point,
        imgtovotes.isWinner,
    ]);
    conn.query(sql,(err,result)=>{
        if(err)throw err;
        res.status(201).json({affected_row: result.affectedRows });
    });
});
