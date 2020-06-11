const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');
const fs = require('fs');
const path = require('path');


// module.exports.create = async function(req, res){
//     try{
//         let post = await Post.create({
//             content: req.body.content,
//             user: req.user._id,
//         });
        
//         if (req.xhr){
//             // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
//             post = await post.populate('user', 'name').execPopulate();

//             return res.status(200).json({
//                 data: {
//                     post: post
//                 },
//                 message: "Post created!"
//             });
//         }

//         req.flash('success', 'Post published!');
//         return res.redirect('back');

//     }catch(err){
//         req.flash('error', err);
//         // added this to view the error on console as well
//         console.log(err);
//         return res.redirect('back');
//     }
  
// }
module.exports.create= async function(req,res){  
    try 
    {       
        var posts;
        var postimages;
        let upload = await Post.uploadPostImage(req, res, function(err)
              {  
                  if(err){console.log(err);return;}
                  console.log('content is ', req.body.content);                 
          
                  if(req.file)
                    {  
                        console.log('in req file');
                        postimages = Post.postimagepath + '/' + req.file.filename;
                        
                    }
                Post.create(
                    {
                        content:req.body.content,
                        user: req.user._id,
                        Postimage: postimages
                    },function(err,post)
                    {
                        if(err){console.log(err);return;}
                        console.log('succesfully added post', post);
                        console.log('file', postimages);
                        posts = post;
                    }
                );
                });
        if(req.xhr)
        {  // returning a json 
                console.log("xhr request");
            //populating only nameof user 
            post = await posts.populate('user', 'name').execPopulate();
                return res.status(200).json(
                    
                    {
                        data:
                        {
                            post: post
                        },
                        message:'Post created!'
                    });
            }
                req.flash('success','Post published!');
                    return res.redirect('back');
        } catch(err)
    {
        req.flash('error',err);
        console.log(err);
        return res.redirect('back');
    }
}


// module.exports.destroy = async function(req, res){

//     try{
//         let post = await Post.findById(req.params.id);

//         if (post.user == req.user.id){
//             post.remove();

//             await Comment.deleteMany({post: req.params.id});


//             if (req.xhr){
//                 return res.status(200).json({
//                     data: {
//                         post_id: req.params.id
//                     },
//                     message: "Post deleted"
//                 });
//             }

//             req.flash('success', 'Post and associated comments deleted!');

//             return res.redirect('back');
//         }else{
//             req.flash('error', 'You cannot delete this post!');
//             return res.redirect('back');
//         }

//     }catch(err){
//         req.flash('error', err);
//         return res.redirect('back');
//     }
    
// }
module.exports.destroy= async function(req,res)
{
     try
     {
        let post=await Post.findById(req.params.id);
        if(post.user==req.user.id){
               // CHANGE :: delete the associated likes for the post and all its comments' likes too
            await Like.deleteMany({likeable: post, onModel: 'Post'});
            await Like.deleteMany({_id: {$in: post.comment}});
            if(post.Postimage){ fs.unlinkSync(path.join(__dirname,'..',post.Postimage));}
            post.remove();
            await  Comment.deleteMany({post:req.params.id});

            if(req.xhr){
                return res.status(200).json(
                    {
                        data:
                        {
                            post_id:req.params.id,
                            
                        },message:'post deleted'
                    }
                );
            }
            req.flash('success', 'Post and associated comments deleted!');

            return res.redirect('back');
            
        }
        else return res.redirect('back');
    }catch(err) {   
        req.flash('error',err);
        console.log(err);
        return res.redirect('back');
    }
}