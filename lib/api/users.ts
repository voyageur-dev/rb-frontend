export interface RegisterRequest {
  email: string;
  password: string;
}

export class UserAlreadyExistsError extends Error {
  constructor() {
    super("User already exists");
    this.name = "UserAlreadyExistsError";
  }
}


export class UserNotConfirmedError extends Error {
  constructor() {
    super("User email not verified");
    this.name = "UserNotConfirmedError";
  }
}


export async function register(data: RegisterRequest) {

  const res = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_BASEURL}/users`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: data.email,
      password: data.password,
    }),
  });

  if (res.status === 400) {
    throw new UserAlreadyExistsError();
  }

  if (res.status === 403) {
    throw new UserNotConfirmedError();
  }

  if (!res.ok) {
    throw new Error("Failed to register user");
  }

  return res.json();
}


export async function refreshToken(refreshToken: string) {

  const res = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_BASEURL}/users/token`, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refreshToken: refreshToken
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to refresh user token");
  }

  return res.json();
}


export async function confirmCode(username: string, code: string) {
  const resp = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_BASEURL}/users/code`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      code: code,
    }),
  });

  if (!resp.ok) {
    throw new Error("Failed to confirm code");
  }
}


export async function resendCode(username: string) {
  const resp = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_BASEURL}/users/resend`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
    }),
  });

  if (!resp.ok) {
    throw new Error("Failed to resend confirm code");
  }
}



