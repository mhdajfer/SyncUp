import { NextFunction, Request, Response } from "express";
import { IAuthUseCases } from "../Interfaces/IAuthUseCases";
import { IUser } from "../Interfaces/IUser";
import bcrypt from "bcrypt";

export class AuthController {
  private authUseCases: IAuthUseCases;

  constructor(authUseCases: IAuthUseCases) {
    this.authUseCases = authUseCases;
  }

  async userLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;
      console.log("got req inside login ", username, password);

      const user = await this.authUseCases.getUserByEmail(username);

      if (!user) return res.status(401).json({ error: "User not exists.." });

      const resObj = await bcrypt.compare(password, user.password);

      if (!resObj) return res.status(401).json({ error: "Invalid password" });

      console.log("logged in successfully.....", user);
      return res.status(200).json({ user });
    } catch (error: any) {
      console.log(`Error while login: ${error}`);
      return res
        .status(400)
        .json({ message: "Error while Login", error: error.message });
    }
  }
}
