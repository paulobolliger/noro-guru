export class AuthContextError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class UnauthenticatedError extends AuthContextError {
  constructor() {
    super('Authentication is required.');
  }
}

export class UserNotFoundError extends AuthContextError {
  constructor() {
    super('Authenticated user is not linked to an internal user profile.');
  }
}

export class UserBlockedError extends AuthContextError {
  constructor() {
    super('User is not allowed to access this resource.');
  }
}

export class TenantRequiredError extends AuthContextError {
  constructor() {
    super('Tenant context is required.');
  }
}

export class TenantAccessDeniedError extends AuthContextError {
  constructor() {
    super('Tenant access denied.');
  }
}

export class PlatformRoleRequiredError extends AuthContextError {
  constructor() {
    super('Platform role is required.');
  }
}

export class ModuleNotEnabledError extends AuthContextError {
  constructor() {
    super('Tenant module is not enabled.');
  }
}

export class AuthorizationDeniedError extends AuthContextError {
  constructor() {
    super('Authorization denied.');
  }
}
