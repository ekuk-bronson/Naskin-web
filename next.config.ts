import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Репозиторий содержит второй lockfile (Expo-приложение в корне) —
  // фиксируем корень, чтобы Turbopack не выбирал его автоматически.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
