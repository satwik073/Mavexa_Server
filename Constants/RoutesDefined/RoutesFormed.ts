interface DEFAULT_USER_AUTHENTICATION_AND_AUTHORIZATION_ROUTES_INTERFACE {
    global_request: string;
    register_user: string;
    login_user: string;
    verify_email_portal: string;
    user_profile: string;
    user_reverification: string;
    reset_user_password: string;
}

interface ADMIN_AUTHENTICATION_AND_AUTHORIZATION_ROUTES_INTERFACE extends DEFAULT_USER_AUTHENTICATION_AND_AUTHORIZATION_ROUTES_INTERFACE {
    admin_global_request:string,
    admin_access_users: string;
    admin_registration_initialised : string;
    admin_login_initailised: string
}

export const USER_SUPPORT_CONFIGURATION: DEFAULT_USER_AUTHENTICATION_AND_AUTHORIZATION_ROUTES_INTERFACE = {
    global_request : '/api/v1',
    register_user: '/register/user',
    login_user: '/login/user',
    verify_email_portal: '/verify-email',
    user_profile: '/user/profile',
    user_reverification: '/user/reverification',
    reset_user_password: '/user/reset-password',
};

export const ADMIN_SUPPORT_CONFIGURATION: ADMIN_AUTHENTICATION_AND_AUTHORIZATION_ROUTES_INTERFACE = {
    ...USER_SUPPORT_CONFIGURATION,
    admin_global_request:'/api/v1/controls',
    admin_access_users: '/admin/access/users',
    admin_registration_initialised : '/register/admin',
    admin_login_initailised : '/login/admin'
};
