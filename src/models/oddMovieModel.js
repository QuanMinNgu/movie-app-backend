const mongoose = require('mongoose');
const schema = mongoose.Schema;
var slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const oddMovieSchema = new schema({
    viettitle:{
        type:String,
        required:true
    },
    englishtitle:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    backgroundimg:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        slug:"viettitle",
        unique:true
    },
    trailer:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    times:{
        type:String
    },
    NSX:{
        type:String
    },
    country:{
        type:String
    },
    watching:{
        type:Number,
        default:0
    },
    reviewer:{
        type:String
    },
    rating:{
        type:String
    },
    categary:{
        type:String
    },
    kind:{
        type:String,
        required:true
    }
},{
    timestamps:true
});

oddMovieSchema.index({viettitle:"text",englishtitle:"text"});
const oldMovie = mongoose.model("OldMovie",oddMovieSchema);
oldMovie.createIndexes({viettitle:"text",englishtitle:"text"});
module.exports = oldMovie;