export async function react(bot,post,project){
 for(let i=0;i<project.reactions;i++){
  setTimeout(()=>{
   bot.telegram.sendReaction(post.chat.id,post.message_id,{reaction:[{type:'emoji',emoji:'❤️'}]})
  },i*project.delay);
 }
}