import { NextFunction, Request, Response } from "express";
import stripe from "stripe";
import { CustomError } from "../ErrorHandler/CustonError";
import { StatusCode } from "../interfaces/StatusCode";

export class PaymentController {
  async createPaymentIntent(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { amount, currency } = req.body;

      if (!process.env.STRIPE_SECRET_KEY)
        throw new CustomError(
          "stripe secret key not found",
          StatusCode.CONFLICT
        );

      const stripeT = new stripe(process.env.STRIPE_SECRET_KEY);

      if (!amount || !currency) {
        res
          .status(StatusCode.BAD_REQUEST)
          .json({ error: "Amount and currency are required." });
      }

      const paymentIntent = await stripeT.paymentIntents.create({
        amount,
        currency,
        payment_method_types: ["card"],
      });

      res.status(StatusCode.OK).json({
        success: true,
        message: "retrieved client secret",
        data: paymentIntent.client_secret,
      });
    } catch (error) {
      console.error("Error creating PaymentIntent:", error);
      next(error);
    }
  }
}
