export type ICPAuthReturn = {
  loginWithInternetIdentity: () => Promise<void>;
  logout: () => Promise<void>;
};

export type DisplayProfile = {
  name : string,
  email : string,
  image : string,
  libraries: number,
  sounds: number
};

export interface NonPrincipalCreateLibraryRequest {
  creator_name : string,
  thumbnail : string,
  name : string,
  description : string,
}

export type Result<T> = Success<T> | Failure;

export interface Success<T> {
  ok: true;
  value: T;
}

export interface Failure {
  ok: false;
  error: string;
}

export function succeed<T>(value: T): Result<T> {
  return { ok: true, value };
}

export function fail(error: string): Result<never> {
  return { ok: false, error };
}