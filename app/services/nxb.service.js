const { ObjectId } = require("mongodb");
class NxbService {
    constructor(client) {
        this.Nxb = client.db().collection("nhaxuatban");
    }
    extractNxbData(payload) {
        const nxb = {
            tennxb: payload.tennxb,
            diachi: payload.diachi,
        };
        // Remove undefined fields
        Object.keys(nxb).forEach(
            (key) => nxb[key] === undefined && delete nxb[key]
        );
      
        return nxb;
    }
    async create(payload) {
        const nxb = this.extractNxbData(payload);
        const result = await this.Nxb.findOneAndUpdate(
            nxb,
            { $set: {} },
            { returnDocument: "after", upsert: true }
        );
        
        return result.value;
    }
    async find(filter) {
        const cursor = await this.Nxb.find(filter);
        return await cursor.toArray();
    }
    async findByName(tennxb) {
        return await this.find({
            tennxb: { $regex: new RegExp(tennxb), $options: "i" },
        });
    }
    async findById(id) {
        return await this.Nxb.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }
    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractNxbData(payload);
        const result = await this.Nxb.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result.value;
    }
    async delete(id) {
        const result = await this.Nxb.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result.value;
    }
    async findFavorite() {
        return await this.find({ favorite: true });
    }      
    async deleteAll() {
        const result = await this.Nxb.deleteMany({});
        return result.deletedCount;
    }
                 
}

module.exports= NxbService;