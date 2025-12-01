"use client";

import { ReactNode, useEffect, useState } from "react";

export default function ClientOnly({ children }: { children: ReactNode }) {
	const [mount, setMount] = useState(false);

	useEffect(() => {
		setMount(true);
	});

	if (!mount) return null;
	return children;
}
