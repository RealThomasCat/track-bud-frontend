import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    output: "standalone", // optimize production deployment by generating a self-contained server build.
    reactCompiler: true,
};

export default nextConfig;
