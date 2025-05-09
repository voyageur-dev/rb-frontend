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
      "content-type": "application/json",
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
      "content-type": "application/json",
    },
    body: JSON.stringify({
      refreshToken: refreshToken
    }),
  });

  if (res.ok) {
    return res.json();
  }
}