"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientFormDevService = void 0;
const common_1 = require("@nestjs/common");
let ClientFormDevService = class ClientFormDevService {
    constructor() {
        this.mockData = [];
    }
    async create(createClientFormDto) {
        const clientForm = {
            id: Date.now().toString(),
            namaLengkap: createClientFormDto.personalData.namaLengkap,
            nomorHP: createClientFormDto.personalData.nomorHP,
            email: createClientFormDto.personalData.email,
            jumlahEntitas: createClientFormDto.jumlahEntitas,
            jasaYangDibutuhkan: JSON.stringify(createClientFormDto.jasaYangDibutuhkan),
            companies: JSON.stringify(createClientFormDto.companies),
            createdAt: new Date(),
        };
        this.mockData.push(clientForm);
        return clientForm;
    }
    async findAll() {
        return this.mockData;
    }
    async findOne(id) {
        return this.mockData.find(item => item.id === id) || null;
    }
};
exports.ClientFormDevService = ClientFormDevService;
exports.ClientFormDevService = ClientFormDevService = __decorate([
    (0, common_1.Injectable)()
], ClientFormDevService);
