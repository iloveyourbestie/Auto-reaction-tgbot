const m=new Map();
export function antiSpam(ctx,next){
 const id=ctx.from?.id;
 if(!id) return next();
 const n=Date.now();
 if(m.has(id)&&n-m.get(id)<1200) return;
 m.set(id,n); return next();
}