type RouteAuthentication =
  | {
      required: false;
    }
  | {
      required: true;      
    };

declare module 'vue-router' {
  interface RouteMeta {
    authentication: RouteAuthentication;
  }
}

export default ProtectedRoute;