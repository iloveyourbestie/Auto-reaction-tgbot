export async function forceJoin(ctx,next){
 if(ctx.from?.id===Number(process.env.OWNER_ID)) return next();
 try{
  const m=await ctx.telegram.getChatMember(process.env.FORCE_JOIN_CHANNEL,ctx.from.id);
  if(['left','kicked'].includes(m.status))
   return ctx.reply('❌ Join @legendyt830 first');
 }catch{}
 return next();
}