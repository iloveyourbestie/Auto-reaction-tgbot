import {db} from '../db.js';
export async function normalizePlan(uid){
 const r=await db.query('SELECT plan,plan_expires FROM users WHERE telegram_id=$1',[uid]);
 if(!r.rows.length) return 'free';
 const {plan,plan_expires}=r.rows[0];
 if(plan==='free') return 'free';
 if(plan==='antimatter'){
  if(uid==process.env.OWNER_ID) return 'antimatter';
  await db.query("UPDATE users SET plan='free',plan_expires=NULL WHERE telegram_id=$1",[uid]);
  return 'free';
 }
 if(!plan_expires||new Date(plan_expires)>new Date()) return plan;
 await db.query("UPDATE users SET plan='free',plan_expires=NULL WHERE telegram_id=$1",[uid]);
 return 'free';
}