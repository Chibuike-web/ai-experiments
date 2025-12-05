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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
	const [date, setDate] = useState<Date | undefined>(undefined);

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError("");
		setUi([]);
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
		<main className="max-w-6xl mx-auto py-10 px-6 xl:px-0">
			<div className="flex flex-col md:flex-row gap-10 bg-gray-50 p-4 rounded-2xl">
				<div className="flex flex-col gap-4 w-full">
					<div className="w-full">
						<h1 className="text-4xl font-bold">Form Builder</h1>
						<p className="text-[18px] text-muted-foreground mt-2">
							Describe what information you want to collect and we’ll generate the form for it
						</p>
					</div>
					<div className="w-full">
						<form className="flex flex-col items-center gap-2" onSubmit={handleSubmit}>
							<Textarea
								ref={inputRef}
								placeholder="Describe your form"
								className="bg-white"
								name="input"
								onInput={() => setError("")}
							/>
							<Button className="w-full" disabled={isPending} type="submit">
								{isPending ? "Creating..." : "Create"}
							</Button>
						</form>

						{error && <p className="text-red-500 text-sm mt-2">{error}</p>}
					</div>
				</div>
				<form className="w-full">
					<h2 className="text-2xl font-semibold mb-4">Generated Form</h2>
					{ui.length > 0 && (
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
										case "file":
											return (
												<div key={u.id}>
													<div className="flex items-center gap-1 mb-2">
														<Label htmlFor={u.id}>{u.label}</Label>
														<span className="text-[14px] text-muted-foreground">
															{u.required && "(required)"}
														</span>
													</div>
													<Input
														type={u.component}
														{...commonProps}
														placeholder={`Enter your ${u.label}`}
														className="bg-white"
													/>
												</div>
											);

										case "date":
											return (
												<div key={u.id}>
													<Label htmlFor={u.id} className="mb-2">
														{u.label}
													</Label>
													<Popover>
														<PopoverTrigger asChild>
															<Button
																variant="outline"
																id="date"
																className="justify-between font-normal w-full text-[16px] text-muted-foreground hover:bg-white hover:text-muted-foreground"
															>
																{date ? date.toDateString() : u.label}
																<ChevronDownIcon />
															</Button>
														</PopoverTrigger>
														<PopoverContent className="w-auto overflow-hidden p-0" align="start">
															<Calendar
																mode="single"
																selected={date}
																captionLayout="dropdown"
																onSelect={(date) => {
																	setDate(date);
																}}
															/>
														</PopoverContent>
													</Popover>
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
														<SelectTrigger className="w-full mt-2 text-[16px] text-muted-foreground bg-white">
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

										case "radio":
											return (
												<div key={u.id}>
													<p className="mb-2 font-medium">{separateString(u.label)}</p>
													<RadioGroup name={u.id} required={u.required}>
														{u.options.length > 0 &&
															u.options.map((opt) => (
																<div key={opt} className="flex items-center gap-3">
																	<RadioGroupItem value={opt} id={`${u.id}-${opt}`} />
																	<Label htmlFor={`${u.id}-${opt}`}>{toSentenceCase(opt)}</Label>
																</div>
															))}
													</RadioGroup>
												</div>
											);

										case "text-area":
											return (
												<div key={u.id}>
													<Label htmlFor={u.id} className="mb-2">
														{u.label}
													</Label>
													<Textarea
														ref={inputRef}
														placeholder="Describe your form"
														className="bg-white"
														name={u.id}
													/>
												</div>
											);
										default:
											return (
												<div key={u.id}>
													<Label htmlFor={u.id}> {u.label}</Label>
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
					)}
				</form>
			</div>
		</main>
	);
}
