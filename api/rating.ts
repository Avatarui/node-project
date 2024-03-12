import express from "express";
import {conn, mysql, queryAsync} from "../dbconnect";
// import { UpDateImg } from "../model/updateimg";
export const router = express.Router();
//rating all
// router.get("/", (req, res) => {
//     conn.query('SELECT * FROM `picture` ORDER BY `point` DESC LIMIT 10', (err, result, fields) => {
//         if (result && result.length > 0) {
//             res.json(result);
//         } else {
//             res.json({
//                 success: false,
//             });
//         }
//     });
// });


router.get("/yesterday", (req, res) => {
    conn.query(
      `
          SELECT  
              picture.*,
              RANK() OVER (ORDER BY SUM(vote.point) DESC)
          FROM 
                picture,vote
          WHERE  
            picture.picture_id = vote.picture_id
          AND
              DATE(vote.date) = CURDATE() - INTERVAL 1 DAY
          GROUP BY 
            picture.picture_id, picture.url, picture.description, picture.point, picture.uid 
          ORDER BY 
            picture.point DESC
          LIMIT 0, 10 `,
      (err, result, fields) => {
        if (result && result.length > 0) {
          res.json(result);
        } else {
          res.json({
            success: false,
          });
        }
      }
    );
  });
  
  router.get("/today", (req, res) => {
    conn.query(
      `
          SELECT  
              picture.*,
              RANK() OVER (ORDER BY SUM(vote.point) DESC)
          FROM 
            picture,vote
          WHERE  
              image.imageid = vote.imgid
          GROUP BY 
            picture.picture_id, picture.url, picture.description, picture.point, picture.uid
          ORDER BY 
            picture.point DESC
          LIMIT 0, 10 `,
      (err, result, fields) => {
        if (result && result.length > 0) {
          // ส่ง response กลับด้วยข้อมูลผู้ใช้
          res.json(result);
        } else {
          // ถ้าไม่พบผู้ใช้, ส่ง response กลับเป็น { success: false }
          res.json({
            success: false,
          });
        }
      }
    );
  });
  
  router.get("/graph/:uid", (req, res) => {
    let uid = +req.params.uid;
    const sql = `
    SELECT 
    GROUP_CONCAT(voteDate ORDER BY voteDate ASC) AS voteDate,
    GROUP_CONCAT(totalScore ORDER BY voteDate ASC) AS totalScore,
    picture_id,
    description,
    url
    FROM (
        SELECT 
        DATE(date) AS voteDate,
        500 + SUM(vote.point) AS totalScore,
        vote.picture_id,
        picture.description,
        picture.url
        FROM vote,picture
        WHERE vote.picture_id = picture.picture_id
           AND DATE(date) >= CURDATE() - INTERVAL 7 DAY
        AND DATE(date) < CURDATE()
        AND vote.uid = ?
        GROUP BY DATE(date), picture_id
        ) AS subquery
        GROUP BY picture_id
        ORDER BY picture_id, MAX(voteDate) ASC
      `;
    conn.query(sql, [uid], (err, result, fields) => {
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