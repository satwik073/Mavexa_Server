import { DefaultRequestMethods} from "../../Common/structure";


export type SchemaCreationType = {
    __WORKFLOWS: string;
    __CONNECTION: string;
    __EDGE: string;
};

const SchemaInstance: SchemaCreationType = {
    __WORKFLOWS: 'workflows',
    __CONNECTION: 'connections',
    __EDGE: 'edges',
};

interface DEFAULT_PARAMETER {
    compressor(configType: keyof SchemaCreationType): string;
}

interface TRACING_TRAJECTORIES {
    generatingRouteForSchema(schemaTypeConfig: keyof SchemaCreationType, connectionType: DefaultRequestMethods): string;
}

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
    admin_global_request: string;
    admin_access_users: string;
    admin_registration_initialised: string;
    admin_login_initailised: string;
}

export const USER_SUPPORT_CONFIGURATION: DEFAULT_USER_AUTHENTICATION_AND_AUTHORIZATION_ROUTES_INTERFACE = {
    global_request: '/api/v1',
    register_user: '/register/user',
    login_user: '/login/user',
    verify_email_portal: '/verify-email',
    user_profile: '/user/profile',
    user_reverification: '/user/reverification',
    reset_user_password: '/user/reset-password',
};

export const ADMIN_SUPPORT_CONFIGURATION: ADMIN_AUTHENTICATION_AND_AUTHORIZATION_ROUTES_INTERFACE = {
    ...USER_SUPPORT_CONFIGURATION,
    admin_global_request: '/api/v1/controls',
    admin_access_users: '/admin/access/users',
    admin_registration_initialised: '/register/admin',
    admin_login_initailised: '/login/admin',
};
export const DEPENDING_FORMATS: DEFAULT_PARAMETER = {
    compressor: (configType: keyof SchemaCreationType): string => {
        switch (configType) {
            case '__WORKFLOWS':
                return '/api/v1/services/premium/workflow-nodes';
            default:
                return `/unknown-method`;
        }
    }
}
export const SETTINGS_INITIATED: TRACING_TRAJECTORIES = {
    generatingRouteForSchema: (schemaTypeConfig: keyof SchemaCreationType, connectionType: DefaultRequestMethods): string => {
        switch (connectionType) {
            case DefaultRequestMethods.POST:
                return `/generation/${SchemaInstance[schemaTypeConfig]}`;
            case DefaultRequestMethods.GET:
                `/retrieve/${SchemaInstance[schemaTypeConfig]}`;
            case DefaultRequestMethods.PUT:
                return `/update/${SchemaInstance[schemaTypeConfig]}`;
            case DefaultRequestMethods.DELETE:
                return `/delete/${SchemaInstance[schemaTypeConfig]}`;
            case DefaultRequestMethods.OPT:
                return `/options/${SchemaInstance[schemaTypeConfig]}`;
            case DefaultRequestMethods.PATCH:
                return `/patch/${SchemaInstance[schemaTypeConfig]}`;
            default:
                return `/unknown-method/${SchemaInstance[schemaTypeConfig]}`;
        }
    }
};