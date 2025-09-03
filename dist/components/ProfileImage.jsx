"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProfileImage;
const image_1 = __importDefault(require("next/image"));
const react_1 = require("react");
function ProfileImage({ src, alt, width, height, className = '', priority = false }) {
    const [imgSrc, setImgSrc] = (0, react_1.useState)(src);
    const handleError = () => {
        setImgSrc('/img/karyawan/placeholder.svg');
    };
    return (<image_1.default src={imgSrc} alt={alt} width={width} height={height} className={className} priority={priority} onError={handleError}/>);
}
