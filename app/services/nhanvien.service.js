const { ObjectId } = require("mongodb");
class NhanvienService {
    constructor(client) {
        this.Nhanvien = client.db().collection("nhanvien");
    }
    extractNhanvienData(payload) {
        const nhanvien = {
            HoTenNV: payload.HoTenNV,
            Password: payload.Password,
            ChucVu: payload.ChucVu,
            DiaChi: payload.DiaChi,
            SoDienThoai: payload.SoDienThoai,
        };
        // Remove undefined fields
        Object.keys(nhanvien).forEach(
            (key) => nhanvien[key] === undefined && delete nhanvien[key]
        );
      
        return nhanvien;
    }
    async create(payload) {
        const nhanvien = this.extractNhanvienData(payload);
        const result = await this.Nhanvien.findOneAndUpdate(
            nhanvien,
            { $set: {} },
            { returnDocument: "after", upsert: true }
        );
        
        return result.value;
    }
    async find(filter) {
        const cursor = await this.Nhanvien.find(filter);
        return await cursor.toArray();
    }
    async findByName(HotenNV) {
        return await this.find({
            name: { $regex: new RegExp(HotenNV), $options: "i" },
        });
    }
    async findById(id) {
        return await this.Nhanvien.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }
    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractNhanvientData(payload);
        const result = await this.Nhanvien.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result.value;
    }
    async delete(id) {
        const result = await this.Nhanvien.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result.value;
    }
    async findFavorite() {
        return await this.find({ favorite: true });
    }      
    async deleteAll() {
        const result = await this.Nhanvien.deleteMany({});
        return result.deletedCount;
    }
                 
}

module.exports= NhanvienService;