const DocgiaService = require("../services/docgia.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next)=>{
    if(!req.body?.ten){
        return next(new ApiError(400, "Name can not be empty"));
    }
    try {
         const docgiaService= new DocgiaService(MongoDB.client);
         const document = await docgiaService.create(req.body);

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
        const docgiaService = new DocgiaService(MongoDB.client);
        const {name}= req.query;
        if(name){
            documents = await docgiaService.findByName(name);
        }else{
            documents= await docgiaService.find({});
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
        const docgiaService = new DocgiaService(MongoDB.client);
        const document = await docgiaService.findById(req.params.id);
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
        const docgiaService= new DocgiaService(MongoDB.client);
        const document= await docgiaService.update(req.params.id, req.body);
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
        const docgiaService= new DocgiaService(MongoDB.client);
        const document = await docgiaService.delete(req.params.id);
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
        const docgiaService= new DocgiaService(MongoDB.client);
        const documents = await docgiaService.findFavorite();
        return res.send(documents);
       
    }catch (error){
        return next(
            new ApiError(500,"An error occurred while retrieving favorite contacts")
        );
    }
};
exports.deleteAll = async(req, res, next) => {
    try {
        const docgiaService= new DocgiaService(MongoDB.client);
        const deletedCount = await docgiaService.deleteAll();
        
        return res.send({message:`${deletedCount} contacts were deleted succesfully` });
    }catch (error){
        return next(
            new ApiError(500,"An error occurred while removing all contacts")
        );
    }
};
exports.findBySdt = async (req, res, next) => {
    try {
        const docgiaService = new DocgiaService(MongoDB.client);
        const document = await docgiaService.getBySdt(req.params.sdt);
        if (!document) {
            return next(new ApiError(404, "doc gia không tồn tại"));
        }
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, `Lỗi khi lấy doc gia theo số điện thoại: ${error.message}`));
    }
};