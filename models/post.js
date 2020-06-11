const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const PostImage_PATH = path.join('/uploads/users/posts');

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    user: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'User'

    },
    // include the array of ids of all comments in this post schema itself
    comments: [
        {
            type:  mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Like'
        }
    ],
    Postimage:
        {
            type:String
        }
},{
    timestamps: true
});

let storage = multer.diskStorage(
    {
        destination:function(req, file, cb)
            {
                cb(null,path.join(__dirname, '..', PostImage_PATH));
            },
        filename:function(req, file, cb)
            {  
                cb(null, file.fieldname + '-' + Date.now());
            }
    }
);

postSchema.statics.uploadPostImage = multer({storage:storage}).single('postimage');
postSchema.statics.postimagepath = PostImage_PATH;

const Post = mongoose.model('Post', postSchema);
module.exports = Post;