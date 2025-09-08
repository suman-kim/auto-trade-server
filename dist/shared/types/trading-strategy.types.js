"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategyType = exports.StrategyStatus = exports.SignalType = void 0;
var SignalType;
(function (SignalType) {
    SignalType["BUY"] = "BUY";
    SignalType["SELL"] = "SELL";
    SignalType["HOLD"] = "HOLD";
})(SignalType || (exports.SignalType = SignalType = {}));
var StrategyStatus;
(function (StrategyStatus) {
    StrategyStatus["ACTIVE"] = "active";
    StrategyStatus["INACTIVE"] = "inactive";
    StrategyStatus["PAUSED"] = "paused";
})(StrategyStatus || (exports.StrategyStatus = StrategyStatus = {}));
var StrategyType;
(function (StrategyType) {
    StrategyType["MOMENTUM"] = "momentum";
    StrategyType["MEAN_REVERSION"] = "mean_reversion";
    StrategyType["BREAKOUT"] = "breakout";
    StrategyType["SCALPING"] = "scalping";
    StrategyType["SWING"] = "swing";
})(StrategyType || (exports.StrategyType = StrategyType = {}));
//# sourceMappingURL=trading-strategy.types.js.map