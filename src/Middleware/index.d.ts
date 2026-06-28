import type { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload; //user is the proparty that we want to set, and jwtpayload is its type.
    }
  }
}
