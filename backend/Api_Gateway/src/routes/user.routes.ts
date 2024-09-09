import { createProxyMiddleware } from "http-proxy-middleware";
import express from "express";
import { USER_SERVICE_URL } from "../Utils/Consts";

const router = express.Router();

router.use(
  createProxyMiddleware({
    target: USER_SERVICE_URL,
    changeOrigin: true,
  })
);

export default router;
