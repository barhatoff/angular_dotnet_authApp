### Angular 20 | .NET 9 (ASP.NET Core) | PostgreSQL

## Authentication example combining an Angular front-end and .NET back-end with PostgreSQL.Ready to production readiness and scaling.

## ./runApp.sh to run

## Application Features

### **Authentication & Tokens**
- **Access Token** — short-lived JWT used for authenticated API requests.  
- **Refresh Token** — long-lived token stored securely and used to obtain new access tokens without re-login.  
- Automatic token refresh flow is supported on the client.

---

### **RBAC (Role-Based Access Control)**
- Users have assigned roles (e.g., `admin`, `user`, etc.).  
- Angular guards protect routes based on required roles.  
- Backend enforces role checks on protected endpoints.  
- Easy to extend with custom permissions.

---

### **Audit Logging**
- Backend records key security-related actions (login, logout, admin updates, etc.).  
- Audit entries contain user, timestamp, action, and optional metadata.  
- Designed for compliance and traceability.

---

### **Administration Panel**
- User management (view users, activate/deactivate, assign roles).  
- System monitoring endpoints can be extended.  
- Admin-only area protected by RBAC.

---

### **User Profile Management**
- Users can view and update personal details.  
- Supports editing email, password change, and profile-related settings.  
- Includes validation and secure update flow via API.



### Angular code generation helpers

- **`g:s <name>`**  
  Generates a new service in `core/services/`.

- **`g:u <name>`**  
  Generates a utility class in `core/utils/`.

- **`g:interceptor <name>`**  
  Generates an HTTP interceptor in `core/interceptors/`.

- **`g:guard <name>`**  
  Generates a route guard in `core/guards/`.

- **`g:s:api <name>`**  
  Creates:
  - `core/services/api/<name>/<name>-api.service.ts`
  - request interface  
  - response interface  

- **`g:route <feature> [componentName]`**  
  - If only `<feature>` is passed → creates `features/<feature>.component`.  
  - If both args passed → creates `features/<feature>/<componentName>.component`.

- **`g:model <name>`**  
  Generates a model interface in `shared/models/`.

- **`g:shared:c <dir> [componentName]`**  
  Generates a shared component in `shared/components/`, optionally inside a subfolder.

- **`g:layer <name>`**  
  Generates a new shared layer component in `shared/layers/<name>-layer`.

