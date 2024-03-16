const TheodoiService = require("../services/theodoi.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next)=>{
    if(!req.body?.ngaymuon){
        return next(new ApiError(400, "Name can not be empty"));
    }
    try {
         const theodoiService= new TheodoiService(MongoDB.client);
         const document = await theodoiService.create(req.body);

         return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An error occured while creating the contact")
        );
    }
};

exports.findAll = async (req, res, next) => {
    let document= [];
    try {
        const theodoiService = new TheodoiService(MongoDB.client);
        const {ngaymuon}= req.query;
        if(ngaymuon){
            documents = await theodoiService.findByDate(ngaymuon);
        }else{
            documents= await theodoiService.find({});
        }
    } catch(error){
        return next(
            new ApiError(500,"An error occured while retrieving contacts")
        );
    }
    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    
    try {
        const theodoiService = new TheodoiService(MongoDB.client);
        const document = await theodoiService.findById(req.params.id);
        if(!document){
            return next(new ApiError(404,"Contact not found"));
        }
        return res.send(document);
    } catch(error){
        return next(
            new ApiError(500,`Error retrieving contact with id=${req.params.id}`)
        );
    }
};

exports.update = async (req, res , next) => {
    if(Object.keys(req.body).length===0){
        return next(new ApiError(400, "Data to update can not be empty"));
    }
    try {
        const theodoiService= new TheodoiService(MongoDB.client);
        const document= await theodoiService.update(req.params.id, req.body);
        if(document){
            return next(new ApiError(404,"Contact not found"));
        }
        return res.send({message:"Contact was updated successfully"});
    } catch (error){
        return next(
            new ApiError(500,`Error updating contact with id=${req.params.id}`)
        );
    }
};


exports.delete = async (req, res, next) => {
    try {
        const theodoiService= new TheodoiService(MongoDB.client);
        const document = await theodoiService.delete(req.params.id);
        if(document){
            return next(new ApiError(404,"Contact not found"));
        }
        return res.send({message: "Contact was deleted successfully"});
    }catch (error){
        return next(
            new ApiError(500,`Could not delete contact with id=${req.params.id}`)
        );
    }
};

exports.findAllFavorite =  async(req, res, next) => {
    try {
        const theodoiService= new TheodoiService(MongoDB.client);
        const documents = await theodoiService.findFavorite();
        return res.send(documents);
       
    }catch (error){
        return next(
            new ApiError(500,"An error occurred while retrieving favorite contacts")
        );
    }
};
exports.deleteAll = async(req, res, next) => {
    try {
        const theodoiService= new TheodoiService(MongoDB.client);
        const deletedCount = await theodoiService.deleteAll();
        
        return res.send({message:`${deletedCount} contacts were deleted succesfully` });
    }catch (error){
        return next(
            new ApiError(500,"An error occurred while removing all contacts")
        );
    }
};
