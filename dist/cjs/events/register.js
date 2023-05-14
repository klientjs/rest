"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@klient/core");
class RegisterEvent extends core_1.Event {
    constructor(resource) {
        super();
        this.resource = resource;
    }
}
exports.default = RegisterEvent;
RegisterEvent.NAME = 'rest:register';
