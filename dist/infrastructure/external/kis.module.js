"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KisModule = void 0;
const common_1 = require("@nestjs/common");
const kis_api_service_1 = require("./kis-api.service");
const kis_websocket_service_1 = require("./kis-websocket.service");
const typeorm_1 = require("@nestjs/typeorm");
const stock_entity_1 = require("../../entities/stock.entity");
const kis_schedules_1 = require("./kis-schedules");
const users_module_1 = require("../../modules/users/users.module");
let KisModule = class KisModule {
};
exports.KisModule = KisModule;
exports.KisModule = KisModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([stock_entity_1.Stock]),
            users_module_1.UsersModule,
        ],
        providers: [kis_api_service_1.KisApiService, kis_websocket_service_1.KisWebSocketService, kis_schedules_1.KisSchedules],
        exports: [kis_api_service_1.KisApiService, kis_websocket_service_1.KisWebSocketService, kis_schedules_1.KisSchedules],
    })
], KisModule);
//# sourceMappingURL=kis.module.js.map