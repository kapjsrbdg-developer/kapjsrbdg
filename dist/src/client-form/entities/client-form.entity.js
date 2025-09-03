"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientForm = void 0;
const typeorm_1 = require("typeorm");
let ClientForm = class ClientForm {
};
exports.ClientForm = ClientForm;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ClientForm.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nama_lengkap' }),
    __metadata("design:type", String)
], ClientForm.prototype, "namaLengkap", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nomor_hp' }),
    __metadata("design:type", String)
], ClientForm.prototype, "nomorHP", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ClientForm.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'jumlah_entitas' }),
    __metadata("design:type", Number)
], ClientForm.prototype, "jumlahEntitas", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'jasa_yang_dibutuhkan' }),
    __metadata("design:type", String)
], ClientForm.prototype, "jasaYangDibutuhkan", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], ClientForm.prototype, "companies", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ClientForm.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ClientForm.prototype, "updatedAt", void 0);
exports.ClientForm = ClientForm = __decorate([
    (0, typeorm_1.Entity)('client_forms')
], ClientForm);
