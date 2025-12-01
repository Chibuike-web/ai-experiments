"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { separateString } from "@/lib/separate-string";
import { toSentenceCase } from "@/lib/toSentenceCase";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";

import { FormEvent, useRef, useState, useTransition } from "react";

type UIType = {
	id: string;
	label: string;
	component: string;
	required: boolean;
	options: string[];
};

export default function FormBuilderClient() {
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState("");
	const [ui, setUi] = useState<UIType[]>([]);
	const inputRef = useRef<HTMLTextAreaElement>(null);

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError("");
		const formdata = new FormData(e.currentTarget);
		const input = formdata.get("input") as string;

		if (input.length < 10) {
			setError("Input must be at least 10 characters");
			return;
		}

		startTransition(async () => {
			try {
				const res = await fetch("/api/form-builder", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ input }),
				});

				const data = await res.json();
				if (!res.ok) {
					setError(data.error || "Something went wrong");
					return;
				}

				console.log(data);
				setUi(data.content.fields);

				if (inputRef.current) inputRef.current.value = "";
			} catch {
				setError("Network error");
			}
		});
	};

	return (
		<div>
			<div>
				<form className="flex flex-col  items-center gap-2" onSubmit={handleSubmit}>
					<Textarea
						ref={inputRef}
						placeholder="Describe your form"
						name="input"
						onInput={() => setError("")}
					/>
					<Button className="w-full" disabled={isPending} type="submit">
						{isPending ? "Creating..." : "Create"}
					</Button>
				</form>

				{error && <p className="text-red-500 text-sm">{error}</p>}
			</div>
			{ui.length > 0 && (
				<form>
					<h2 className="text-2xl font-semibold mt-10 mb-4">Generated Form</h2>

					<>
						<div className="flex flex-col gap-4">
							{ui.map((u) => {
								const commonProps = {
									id: u.id,
									name: u.id,
									required: u.required,
								};

								switch (u.component) {
									case "text":
									case "number":
									case "date":
										return (
											<div key={u.id}>
												<Label htmlFor={u.id} className="mb-2">
													{separateString(u.label)}
												</Label>
												<Input type={u.component} {...commonProps} />
											</div>
										);

									case "checkbox":
										return (
											<div key={u.id}>
												<Label htmlFor={u.id}>
													<input type={u.component} id={u.id} name={u.id} required={u.required} />{" "}
													{separateString(u.label)}
												</Label>
											</div>
										);

									case "select":
										return (
											<div key={u.id} className="w-full">
												<Label htmlFor={u.id}>{separateString(u.label)}</Label>
												<Select name={u.id} required={u.required}>
													<SelectTrigger className="w-full mt-2">
														<SelectValue placeholder="Select an option" />
													</SelectTrigger>

													<SelectContent>
														{u.options && u.options.length > 0 ? (
															u.options.map((opt) => (
																<SelectItem key={opt} value={opt}>
																	{toSentenceCase(opt)}
																</SelectItem>
															))
														) : (
															<SelectItem value="" disabled>
																No options
															</SelectItem>
														)}
													</SelectContent>
												</Select>
											</div>
										);
									default:
										return (
											<div key={u.id}>
												<Label htmlFor={u.id}> {separateString(u.label)}</Label>
												<Input type="text" {...commonProps} />
											</div>
										);
								}
							})}
						</div>

						<Button type="submit" className="w-full mt-10">
							Submit
						</Button>
					</>
				</form>
			)}
		</div>
	);
}
