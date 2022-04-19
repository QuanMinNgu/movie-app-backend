const OldMovie = require('../models/oddMovieModel');
class apiRequestController{
    constructor(query,queryString){
        this.query = query;
        this.queryString = queryString;
    }

    paginating() {
        const limit = this.queryString.limit * 1 || 8;
        const page = this.queryString.page * 1 || 1;
        const skip = limit * (page - 1);
        this.query = this.query.limit(limit).skip(skip);
        return this;
    }

    searching(){
        const search = this.queryString.search;
        if(search){
            this.query = this.query.find({
                $text:{
                    $search:search
                }
            })
        }
        else{
            this.query = this.query.find()
        }
        return this;
    }

    sorting(){
        const sort = this.queryString.sort || '-createdAt';
        this.query = this.query.sort(sort);
        return this;
    }

    filtering(){
        const obj = {...this.queryString};
        const exclueId = ['page','limit','sort','search'];

        exclueId.forEach(el => delete(obj[el]));

        let strObj = JSON.stringify(obj);
        strObj = strObj.replace(/\b(gte|gt|lte|lt|regex)\b/g,match => "$" + match);
        this.query = this.query.find(JSON.parse(strObj));
        return this;
    }
}
class oddMovieController{
    async getOldMovie(req,res){
        try{
            const api = new apiRequestController(OldMovie.find(),req.query).paginating().searching().sorting().filtering();
            const movie = await api.query;
            const count = await OldMovie.count(api.query.limit(null).skip(null));
            return res.status(200).json({movie,count});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }

    async createOldMovie(req,res){
        try{
            const {viettitle,englishtitle,description,backgroundimg,trailer,status,times,NSX,
                country,watching,reviewer,rating,categary,kind} = req.body;
            const newMovie = new OldMovie({
                viettitle,englishtitle,description,backgroundimg,trailer,status,times,NSX,
                country,watching,reviewer,rating,categary,kind
            });
            await newMovie.save();
            return res.status(200).json({msg:"Tạo thành công."});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }

    async updateOldMovie(req,res){
        try{
            const {viettitle,englishtitle,description,backgroundimg,trailer,status,times,NSX,
                country,watching,reviewer,rating,categary,kind} = req.body;
            const movie = await OldMovie.findOne({slug:req.params.slug});
            if(!movie){
                return res.status(400).json({msg:"Phim này không hề tồn tại."});
            }
            await OldMovie.findByIdAndUpdate(movie._id,{
                viettitle,englishtitle,description,backgroundimg,trailer,status,times,NSX,
                country,watching,reviewer,rating,categary,kind
            });
            return res.status(200).json({msg:"Update thành công."});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }

    async deleteOldMovie(req,res){
        try{
            const movie = await OldMovie.findOne({slug:req.params.slug});
            if(!movie){
                return res.status(400).json({msg:"Bộ phim này không hề tồn tại."});
            }
            await OldMovie.findByIdAndDelete(movie._id);
            return res.status(200).json({msg:`Xóa thành công ${movie.viettitle}`});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }

    async getOne(req,res){
        try{
            const movie = await OldMovie.findOne({slug:req.params.slug});
            if(!movie){
                return res.status(400).json({msg:"Phim không hề tồn tại."});
            }
            return res.status(200).json({movie});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }
}

module.exports = new oddMovieController;