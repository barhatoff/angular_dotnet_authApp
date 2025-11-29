### Angular 20 | .NET 9 (ASP.NET Core) | PostgreSQL

## Authentication example combining an Angular front-end and .NET back-end with PostgreSQL.Ready to production readiness and scaling.

## ./runApp.sh to run

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

