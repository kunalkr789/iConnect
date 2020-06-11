const Freind=require('../models/friendship');
const User=require('../models/user');
const Post = require('../models/post');

module.exports.add=async function(req,res)
{
try{
    let userid=req.query.name;
    let fromuser=await User.findById(userid);
    let touser = await User.findById(req.query.id);

   // searching if the other person has already aed you tolist

   let otherfreind=await Freind.findOne(
       { from_user:req.query.id,
        to_name:fromuser.name,
     
        to_user:userid,
       }
   );
  console.log('checking alrready freind fromother',otherfreind);
   if(otherfreind) 
   {   console.log('your freind found');

            let friend={
                name:touser.name,
                id:`${otherfreind._id}`,
                _id:touser._id,
                avatar:touser.avatar
            }
          
            fromuser.friendships.push(friend);
            console.log('adding freind', friend,'in ',fromuser.name);

            touser.friendships.push({
            name:fromuser.name,
            id:`${otherfreind._id}`,
            _id:fromuser._id,
            avatar:fromuser.avatar
        });

        console.log('adding freind',fromuser.name,'in',touser.name);
            
        touser.save();
            

        console.log('removing ',fromuser.request.findIndex(x=>x.name==touser.name),'from',fromuser.name);
        fromuser.request.splice(fromuser.request.findIndex(x=>x.name==touser.name),1);
        fromuser.save();
       }


   else

   {
    let existingfreindship= await Freind.findOne(
        {
            from_user:userid,
            to_name:touser.name,
         
            to_user:req.query.id,
           
        });
    console.log('checking ',existingfreindship);
        if(!existingfreindship)
        {
            console.log('creating freindship');
            let freindship=await Freind.create(
                {    to_name:touser.name,
                    from_user:userid,
                    to_user:req.query.id,
                   
                });
                let request={
                    _id:fromuser._id,
                    name:fromuser.name,
                    avatar:fromuser.avatar,
                    id:freindship._id
                }

                touser.request.push(request);
                touser.save();
                console.log('pushing request from ',touser.name,'request to ',request.name);
                req.flash('success','Freind Request Send');
      
        }
    }
        return res.redirect('/');

    }catch(err)
    {
        console.log("error in creating freindship", err);
        return res.redirect('back');
    }
    
}

module.exports.freindprofile=async function(req,res)
{   try
    {  
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        });  
        let user=await User.findById(req.query.type);
        console.log(user);

        return res.render('friends',{
            title:'User Profile',
            profile_user:user,
            id:req.query.id,
            posts: posts
        });
    }catch(err)
    {
        console.log('error in finding profile',err);
        return res.redirect('back');
    }


}

module.exports.removeFreind=async function(req,res)
{
  try{
    // get user id and freind id from route
    console.log(req.query.id);
    let freindship=await Freind.findById(req.query.id);
    console.log(freindship);

    let user= await User.findById(req.query.type);
        var freindname;
        var freindemail;
        var freindid;
        var avat;

        if(user.name != freindship.to_name)
        {
            freindname=freindship.to_name;
            let otheruser=await User.findById(freindship.to_user);
            freindemail=otheruser.email;
            freindid=otheruser._id;
            avat=otheruser.avatar;
                // removing currunt user from other user's freindship list  
                let removeuser=
                {
                    name:user.name,
                    id:req.query.id,
                    _id:user._id,
                    avatar:user.avatar
                }
            console.log('removing user',removeuser);
            console.log(' from',otheruser.name);
            console.log(otheruser.friendships.findIndex(x=>x.name==removeuser.name));
            otheruser.friendships.splice(otheruser.friendships.findIndex(x=>x.name==removeuser.name), 1);
            otheruser.save();
            
        }
        else{
            let freinduser=await User.findById(freindship.from_user);
            freindname=freinduser.name;
            freindemail=freinduser.email;
            freindid=freinduser._id;
            avat=freinduser.avatar;
             // removing currunt user from other user's freindship list  
             let removeuser=
             {
                 name:user.name,
                 id:req.query.id,
                 _id:user._id,
                 avatar:user.avatar
             }
           console.log('removing user',removeuser);
            console.log(' from',freinduser.name)
            console.log(freinduser.friendships.findIndex(x=>x.name==removeuser.name));
             freinduser.friendships.splice(freinduser.friendships.findIndex(x=>x.name==removeuser.name), 1);
             freinduser.save();
             
        }
        freindship.remove();
        let removeuser=
        {
        
            name:freindname,
            id:req.query.id,
            _id:freindid,
            avatar:avat

        }
         let removerequest={
            
             name:freindname,
            
             id:req.query.id,
             _id:freindid,
             avatar:avat
         }
        user.request.splice(user.request.findIndex(x=>x.name==removerequest.name),1);
       
    console.log('removing user',removeuser.name);
    console.log('from',user.name);
    console.log(user.friendships.findIndex(x=>x.name==removeuser.name));
    user.friendships.splice( user.friendships.findIndex(x=>x.name==removeuser.name), 1 );
    user.save();
   
    req.flash('success','User removed from your FriendList');
    return res.redirect('/');
    }catch(err)
        {
            console.log('error in removing freind',err);
            return res.redirect('back');
        }
}