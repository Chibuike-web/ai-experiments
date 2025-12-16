"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toSentenceCase } from "@/lib/toSentenceCase";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormEvent, useState } from "react";
import type { UIType } from "../form-builder-client";

export default function FormPageClient({ ui }: { ui: UIType[] }) {
	const [dates, setDates] = useState<Record<string, Date | undefined>>({});
	const [texts, setTexts] = useState<Record<string, string>>({});
	const [numbers, setNumbers] = useState<Record<string, string>>({});
	const [textAreas, setTextAreas] = useState<Record<string, string>>({});
	const [errors, setErrors] = useState({});

	const handleDate = (id: string, value: Date | undefined) => {
		setDates((prev) => ({
			...prev,
			[id]: value,
		}));
	};

	const handleText = (id: string, value: string) => {
		setTexts((prev) => ({
			...prev,
			[id]: value,
		}));
	};

	const handleNumber = (id: string, value: string) => {
		setNumbers((prev) => ({
			...prev,
			[id]: value,
		}));
	};

	const handleTextArea = (id: string, value: string) => {
		setTextAreas((prev) => ({
			...prev,
			[id]: value,
		}));
	};

	const handleFormSubmit = (e: FormEvent) => {
		e.preventDefault();
		console.log({
			date: dates,
			text: texts,
			number: numbers,
		});
	};

	return (
		<form className="w-full" onSubmit={handleFormSubmit}>
			{ui.length > 0 && (
				<>
					<div className="flex flex-col gap-4">
						{ui.map((u, index) => {
							const commonProps = {
								id: u.id,
								name: u.id,
								required: u.required,
							};

							switch (u.component) {
								case "text":
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
												value={texts[u.id] ?? ""}
												onChange={(e) => handleText(u.id, e.target.value)}
												onInput={() =>
													setErrors((prev) => ({
														...prev,
														[u.id]: "",
													}))
												}
											/>
										</div>
									);
								case "number":
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
												value={numbers[u.id]}
												onChange={(e) => handleNumber(u.id, e.target.value)}
												onInput={() =>
													setErrors((prev) => ({
														...prev,
														[u.id]: "",
													}))
												}
											/>
										</div>
									);
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
														{dates[index] ? dates[index].toDateString() : u.label}
														<ChevronDownIcon />
													</Button>
												</PopoverTrigger>
												<PopoverContent className="w-auto overflow-hidden p-0" align="start">
													<Calendar
														mode="single"
														selected={dates[u.id]}
														captionLayout="dropdown"
														onSelect={(d) => {
															handleDate(u.id, d);
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
												{u.label}
											</Label>
										</div>
									);

								case "select":
									return (
										<div key={u.id} className="w-full">
											<Label htmlFor={u.id}>{u.label}</Label>
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
											<p className="mb-2 font-medium">{u.label}</p>
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
												placeholder={`Enter ${u.label.toLowerCase()} here`}
												className="bg-white"
												name={u.id}
												value={textAreas[u.id]}
												onChange={(e) => handleTextArea(u.id, e.target.value)}
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
	);
}
