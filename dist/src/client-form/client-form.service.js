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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientFormService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const client_form_entity_1 = require("./entities/client-form.entity");
let ClientFormService = class ClientFormService {
    constructor(clientFormRepository) {
        this.clientFormRepository = clientFormRepository;
    }
    async create(createClientFormDto) {
        const clientForm = this.clientFormRepository.create({
            namaLengkap: createClientFormDto.personalData.namaLengkap,
            nomorHP: createClientFormDto.personalData.nomorHP,
            email: createClientFormDto.personalData.email,
            jumlahEntitas: createClientFormDto.jumlahEntitas,
            jasaYangDibutuhkan: JSON.stringify(createClientFormDto.jasaYangDibutuhkan),
            companies: JSON.stringify(createClientFormDto.companies),
        });
        const saved = await this.clientFormRepository.save(clientForm);
        return {
            id: saved.id,
            namaLengkap: saved.namaLengkap,
            nomorHP: saved.nomorHP,
            email: saved.email,
            jumlahEntitas: saved.jumlahEntitas,
            jasaYangDibutuhkan: saved.jasaYangDibutuhkan,
            companies: saved.companies,
            createdAt: saved.createdAt,
        };
    }
    async findAll() {
        const forms = await this.clientFormRepository.find();
        return forms.map(form => ({
            id: form.id,
            namaLengkap: form.namaLengkap,
            nomorHP: form.nomorHP,
            email: form.email,
            jumlahEntitas: form.jumlahEntitas,
            jasaYangDibutuhkan: form.jasaYangDibutuhkan,
            companies: form.companies,
            createdAt: form.createdAt,
        }));
    }
    async findOne(id) {
        const form = await this.clientFormRepository.findOne({ where: { id } });
        if (!form)
            return null;
        return {
            id: form.id,
            namaLengkap: form.namaLengkap,
            nomorHP: form.nomorHP,
            email: form.email,
            jumlahEntitas: form.jumlahEntitas,
            jasaYangDibutuhkan: form.jasaYangDibutuhkan,
            companies: form.companies,
            createdAt: form.createdAt,
        };
    }
};
exports.ClientFormService = ClientFormService;
exports.ClientFormService = ClientFormService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(client_form_entity_1.ClientForm)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ClientFormService);
