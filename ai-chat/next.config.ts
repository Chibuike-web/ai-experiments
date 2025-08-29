import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	serverExternalPackages: [
		"zod",
		"bcryptjs",
		"uuid",
		"class-variance-authority",
		"clsx",
		"@hookform/resolvers",
	],
};

export default nextConfig;
