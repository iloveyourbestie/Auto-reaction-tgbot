import {Telegraf} from 'telegraf';
import {db} from './db.js';
import {PLANS} from './constants.js';
import {normalizePlan} from './services/planGuard.js';
import {antiSpam} from './middlewares/antispam.js';
import {forceJoin} from './middlewares/forceJoin.js';
import {isOwner} from './middlewares/isOwner.js';
import crypto from 'crypto';

export const bot=new Telegraf(process.env.BOT_TOKEN);
bot.use(antiSpam,forceJoin);

bot.use(async(ctx,next)=>{
 if(ctx.from) ctx.userPlan=await normalizePlan(ctx.from.id);
 return next();
});

bot.start(ctx=>ctx.reply('🤖 Multi Reaction Bot Ready'));

bot.command('giveplan',async ctx=>{
 if(!isOwner(ctx)) return;
 const [,uid,plan]=ctx.message.text.split(' ');
 const days=PLANS[plan]?.expiry;
 if(days===null)
  await db.query('UPDATE users SET plan=$1,plan_expires=NULL WHERE telegram_id=$2',[plan,uid]);
 else
  await db.query(`UPDATE users SET plan=$1,plan_expires=NOW()+INTERVAL '${days} days' WHERE telegram_id=$2`,[plan,uid]);
 ctx.reply('Plan updated');
});

bot.command('genkey',async ctx=>{
 if(!isOwner(ctx)) return;
 const [,amt,credits,days]=ctx.message.text.split(' ');
 let out=[];
 for(let i=0;i<Number(amt);i++){
  const k='MRB-'+crypto.randomBytes(4).toString('hex').toUpperCase();
  await db.query(`INSERT INTO license_keys(key,credits,expires_at) VALUES($1,$2,NOW()+INTERVAL '${Math.min(days,15)} days')`,[k,credits]);
  out.push(k);
 }
 ctx.reply(out.join('\n'));
});

bot.command('redeem',async ctx=>{
 const [,k]=ctx.message.text.split(' ');
 const r=await db.query('SELECT * FROM license_keys WHERE key=$1 AND used=false AND expires_at>NOW()',[k]);
 if(!r.rows.length) return ctx.reply('Invalid key');
 await db.query('UPDATE users SET credits=credits+$1 WHERE telegram_id=$2',[r.rows[0].credits,ctx.from.id]);
 await db.query('UPDATE license_keys SET used=true,used_by=$1 WHERE id=$2',[ctx.from.id,r.rows[0].id]);
 ctx.reply('Credits added');
});

bot.on('channel_post',async ctx=>{
 const p=await db.query('SELECT * FROM projects WHERE channel_id=$1 AND active=true',[ctx.chat.id]);
 for(const pr of p.rows){
  const {react}=await import('./services/reactions.js');
  react(bot,ctx.channelPost,pr);
 }
});
