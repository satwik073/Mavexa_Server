"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SETTINGS_INITIATED = exports.DEPENDING_FORMATS = exports.ADMIN_SUPPORT_CONFIGURATION = exports.USER_SUPPORT_CONFIGURATION = void 0;
const structure_1 = require("../../Common/structure");
const SchemaInstance = {
    __WORKFLOWS: 'workflows',
    __CONNECTION: 'connections',
    __EDGE: 'edges',
};
exports.USER_SUPPORT_CONFIGURATION = {
    global_request: '/api/v1',
    register_user: '/register/user',
    login_user: '/login/user',
    verify_email_portal: '/verify-email',
    user_profile: '/user/profile',
    user_reverification: '/user/reverification',
    reset_user_password: '/user/reset-password',
};
exports.ADMIN_SUPPORT_CONFIGURATION = Object.assign(Object.assign({}, exports.USER_SUPPORT_CONFIGURATION), { admin_global_request: '/api/v1/controls', admin_access_users: '/admin/access/users', admin_registration_initialised: '/register/admin', admin_login_initailised: '/login/admin' });
exports.DEPENDING_FORMATS = {
    compressor: (configType) => {
        switch (configType) {
            case '__WORKFLOWS':
                return '/api/v1/services/premium/workflow-nodes';
            default:
                return `/unknown-method`;
        }
    }
};
exports.SETTINGS_INITIATED = {
    generatingRouteForSchema: (schemaTypeConfig, connectionType) => {
        switch (connectionType) {
            case structure_1.DefaultRequestMethods.POST:
                return `/generation/${SchemaInstance[schemaTypeConfig]}`;
            case structure_1.DefaultRequestMethods.GET:
                `/retrieve/${SchemaInstance[schemaTypeConfig]}`;
            case structure_1.DefaultRequestMethods.PUT:
                return `/update/${SchemaInstance[schemaTypeConfig]}`;
            case structure_1.DefaultRequestMethods.DELETE:
                return `/delete/${SchemaInstance[schemaTypeConfig]}`;
            case structure_1.DefaultRequestMethods.OPT:
                return `/options/${SchemaInstance[schemaTypeConfig]}`;
            case structure_1.DefaultRequestMethods.PATCH:
                return `/patch/${SchemaInstance[schemaTypeConfig]}`;
            default:
                return `/unknown-method/${SchemaInstance[schemaTypeConfig]}`;
        }
    }
};
//# sourceMappingURL=RoutesFormed.js.map