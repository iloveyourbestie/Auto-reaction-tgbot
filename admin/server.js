import express from 'express';
import {db} from '../api/db.js';
const app=express();
app.get('/stats',async(_,res)=>{
 const u=await db.query('SELECT COUNT(*) FROM users');
 const p=await db.query('SELECT COUNT(*) FROM projects');
 res.json({users:u.rows[0].count,projects:p.rows[0].count});
});
app.listen(3000);