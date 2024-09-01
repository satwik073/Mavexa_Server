"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADMIN_SUPPORT_CONFIGURATION = exports.USER_SUPPORT_CONFIGURATION = void 0;
exports.USER_SUPPORT_CONFIGURATION = {
    register_user: '/register/user',
    login_user: '/login/user',
    verify_email_portal: '/verify-email',
    user_profile: '/user/profile',
    user_reverification: '/user/reverification',
    reset_user_password: '/user/reset-password',
};
exports.ADMIN_SUPPORT_CONFIGURATION = Object.assign(Object.assign({}, exports.USER_SUPPORT_CONFIGURATION), { admin_access_users: '/admin/access/users' });
//# sourceMappingURL=RoutesFormed.js.map