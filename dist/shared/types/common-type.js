"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventEmitterType = void 0;
var EventEmitterType;
(function (EventEmitterType) {
    EventEmitterType["ORDERBOOK"] = "orderbook";
    EventEmitterType["TRADE"] = "trade";
    EventEmitterType["ORDER_EXECUTION"] = "orderExecution";
    EventEmitterType["BALANCE"] = "balance";
    EventEmitterType["HEARTBEAT"] = "heartbeat";
    EventEmitterType["DISCONNECT"] = "disconnected";
    EventEmitterType["CONNECT"] = "connected";
    EventEmitterType["ERROR"] = "kisError";
    EventEmitterType["RECONNECT"] = "reconnected";
    EventEmitterType["MAX_RECONNECT_ATTEMPTS_REACHED"] = "maxReconnectAttemptsReached";
})(EventEmitterType || (exports.EventEmitterType = EventEmitterType = {}));
//# sourceMappingURL=common-type.js.map