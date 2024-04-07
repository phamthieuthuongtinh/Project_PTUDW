const { ObjectId } = require("mongodb");
class TheodoiService {
    constructor(client) {
        this.Theodoi = client.db().collection("theodoimuonsach");
    }
    extractTheodoiData(payload) {
        const theodoi = {
            madocgia: payload.madocgia,
            masach: payload.masach,
            ngaymuon: payload.ngaymuon,
            ngaytra: payload.ngaytra,
            MSNV: payload.MSNV,
            trangthai: payload.trangthai,
        };
        // Remove undefined fields
        Object.keys(theodoi).forEach(
            (key) => theodoi[key] === undefined && delete theodoi[key]
        );
      
        return theodoi;
    }
    async create(payload) {
        const theodoi = this.extractTheodoiData(payload);
        const result = await this.Theodoi.findOneAndUpdate(
            theodoi,
            { $set: { trangthai: theodoi.trangthai =0 } },
            { returnDocument: "after", upsert: true }
        );
        
        return result.value;
    }
    async find(filter) {
        const cursor = await this.Theodoi.find(filter);
        return await cursor.toArray();
    }
    async findByDate(ngaymuon) {
        return await this.find({
            ngaymuon: { $regex: new RegExp(ngaymuon), $options: "i" },
        });
    }
    async findById(id) {
        return await this.Theodoi.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }
    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractTheodoiData(payload);
        const result = await this.Theodoi.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result.value;
    }
    async delete(id) {
        const result = await this.Theodoi.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result.value;
    }
    async findFavorite() {
        return await this.find({ favorite: true });
    }      
    async deleteAll() {
        const result = await this.Theodoi.deleteMany({});
        return result.deletedCount;
    }
                 
}

module.exports= TheodoiService;