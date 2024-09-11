import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { USER_SERVICE_URL } from "../Utils/Consts";

const router = express.Router();

const proxyMiddleware = createProxyMiddleware({
  target: USER_SERVICE_URL,
  changeOrigin: true,
});

router.use("/", proxyMiddleware);
export default router;