"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    // Enable CORS for frontend integration
    app.enableCors({
        origin: true,
        credentials: true,
    });
    // Enable validation pipes
    app.useGlobalPipes(new common_1.ValidationPipe());
    // Set global prefix for API
    app.setGlobalPrefix('api');
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 NestJS API running on port ${port}`);
}
bootstrap();
