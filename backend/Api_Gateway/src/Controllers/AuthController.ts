import { NextFunction, Request, Response } from "express";
import { IAuthUseCases } from "../Interfaces/IAuthUseCases";

export class AuthController {
  private authUseCases: IAuthUseCases;

  constructor(authUseCases: IAuthUseCases) {
    this.authUseCases = authUseCases;
  }

  async userLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;
      console.log("got req inside login ", username, password);

      const { user, accessToken, refreshToken } = await this.authUseCases.login(
        {
          username,
          password,
        }
      );
      console.log("logged in successfully.....", user);
      return res
        .status(200)
        .cookie("refresh_token", refreshToken, {
          httpOnly: true,
          secure: true,
          maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
        })
        .json({ user: user, accessToken });
    } catch (error: any) {
      console.log(`Error while login: ${error}`);
      return res
        .status(400)
        .json({ message: "Error while Login", error: error.message });
    }
  }

  async isUserLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const token: string = req.cookies.refresh_token;

      const user = await this.authUseCases.verifyUser(token);

      res.status(200).json({ user });
    } catch (error: any) {
      console.log(`Error while login: ${error}`);
      return res
        .status(400)
        .json({ message: "Error while Login", error: error.message });
    }
  }
}
