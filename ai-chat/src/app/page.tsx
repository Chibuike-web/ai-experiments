import { ComponentExample } from "@/components/component-example";
import { Example } from "@/components/example";

export default function Home() {
	return (
		<main>
			<Example title="Example" />
			<ComponentExample />
		</main>
	);
}
