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
	const [files, setFiles] = useState<Record<string, File | null>>({});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [checkboxes, setCheckboxes] = useState<Record<string, string[]>>({});
	const [selects, setSelects] = useState<Record<string, string>>({});
	const [radios, setRadios] = useState<Record<string, string>>({});

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
	const handleFile = (id: string, file: File | null) => {
		setFiles((prev) => ({
			...prev,
			[id]: file,
		}));
	};

	const handleCheckbox = (id: string, option: string, checked: boolean) => {
		setCheckboxes((prev) => ({
			...prev,
			[id]: checked ? [...(prev[id] || []), option] : prev[id].filter((opt) => opt !== option),
		}));
	};

	const handleSelect = (id: string, value: string) => {
		setSelects((prev) => ({
			...prev,
			[id]: value,
		}));
	};

	const handleRadio = (id: string, value: string) => {
		setRadios((prev) => ({
			...prev,
			[id]: value,
		}));
	};
	const handleFormSubmit = (e: FormEvent) => {
		console.log("Error");
		setErrors({});
		e.preventDefault();

		const newErrors: Record<string, string> = {};

		ui.forEach((field) => {
			if (!field.required) return;

			switch (field.component) {
				case "text": {
					const value = texts[field.id];
					if (!value || value.trim() === "") {
						newErrors[field.id] = `This field is required`;
					}
					break;
				}

				case "number": {
					const value = numbers[field.id];
					if (value === undefined || value === "") {
						newErrors[field.id] = `This field is required`;
					}
					break;
				}

				case "date": {
					const value = dates[field.id];
					if (!value) {
						newErrors[field.id] = `This field is required`;
					}
					break;
				}

				case "text-area": {
					const value = textAreas[field.id];
					if (!value || value.trim() === "") {
						newErrors[field.id] = `This field is required`;
					}
					break;
				}

				case "select": {
					const value = selects[field.id];
					if (!value) {
						newErrors[field.id] = `This field is required`;
					}
					break;
				}
				case "radio": {
					const value = texts[field.id];
					if (!value) {
						newErrors[field.id] = `This field is required`;
					}
					break;
				}

				case "file": {
					const file = files[field.id];
					if (!file) {
						newErrors[field.id] = `This field is required`;
					}
					break;
				}

				case "checkbox": {
					const options = checkboxes[field.id];
					if (!options || options.length === 0) {
						newErrors[field.id] = `This field is required`;
					}
					break;
				}
			}
		});

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		const formData = {
			date: dates,
			text: texts,
			number: numbers,
			file: files,
			textArea: textAreas,
		};

		console.log(formData);
	};

	return (
		<form className="w-full" onSubmit={handleFormSubmit}>
			{ui.length > 0 && (
				<>
					<div className="flex flex-col gap-4">
						{ui.map((u) => {
							const commonProps = {
								id: u.id,
								name: u.id,
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
												placeholder={`Enter your ${u.label.toLowerCase()}`}
												className="bg-white"
												value={texts[u.id] ?? ""}
												onChange={(e) => handleText(u.id, e.target.value)}
												onInput={() =>
													setErrors((prev) => ({
														...prev,
														[u.id]: "",
													}))
												}
												aria-describedby={errors[u.id] ? `${u.label} error` : undefined}
												aria-invalid={!!errors[u.id]}
											/>
											{errors[u.id] && <p className="text-sm text-red-500 mt-1">{errors[u.id]}</p>}
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
												placeholder={`Enter your ${u.label.toLowerCase()}`}
												className="bg-white"
												value={numbers[u.id] ?? ""}
												onChange={(e) => handleNumber(u.id, e.target.value)}
												onInput={() =>
													setErrors((prev) => ({
														...prev,
														[u.id]: "",
													}))
												}
												aria-describedby={errors[u.id] ? `${u.label} error` : undefined}
												aria-invalid={!!errors[u.id]}
											/>
											{errors[u.id] && <p className="text-sm text-red-500 mt-1">{errors[u.id]}</p>}
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
												placeholder={`Enter your ${u.label.toLowerCase()}`}
												className="bg-white"
												onChange={(e) => {
													setErrors((prev) => ({
														...prev,
														[u.id]: "",
													}));
													handleFile(u.id, e.target.files?.[0] ?? null);
												}}
												aria-describedby={errors[u.id] ? `${u.label} error` : undefined}
												aria-invalid={!!errors[u.id]}
											/>
											{errors[u.id] && <p className="text-sm text-red-500 mt-1">{errors[u.id]}</p>}{" "}
										</div>
									);

								case "date":
									return (
										<div key={u.id}>
											<div className="flex items-center gap-1 mb-2">
												<Label htmlFor={u.id}>{u.label}</Label>
												<span className="text-[14px] text-muted-foreground">
													{u.required && "(required)"}
												</span>
											</div>
											<Popover
												aria-describedby={errors[u.id] ? `${u.label} error` : undefined}
												aria-invalid={!!errors[u.id]}
											>
												<PopoverTrigger asChild>
													<Button
														variant="outline"
														id="date"
														className="justify-between font-normal w-full text-[16px] text-muted-foreground hover:bg-white hover:text-muted-foreground"
													>
														{dates[u.id]
															? dates[u.id]?.toDateString()
															: `Enter your ${u.label.toLowerCase()}`}
														<ChevronDownIcon />
													</Button>
												</PopoverTrigger>
												<PopoverContent className="w-auto overflow-hidden p-0" align="start">
													<Calendar
														mode="single"
														selected={dates[u.id]}
														captionLayout="dropdown"
														onSelect={(d) => {
															setErrors((prev) => ({
																...prev,
																[u.id]: "",
															}));
															handleDate(u.id, d);
														}}
													/>
												</PopoverContent>
											</Popover>
											{errors[u.id] && <p className="text-sm text-red-500 mt-1">{errors[u.id]}</p>}
										</div>
									);
								case "checkbox":
									return (
										<div key={u.id} className="space-y-3">
											<div className="flex items-center gap-1 mb-2">
												<span className="font-medium">{u.label}</span>
												<span className="text-[14px] text-muted-foreground">
													{u.required && "(required)"}
												</span>
											</div>

											<div className="space-y-2">
												{u.options.map((opt) => (
													<div key={opt} className="flex items-center gap-2">
														<input
															type="checkbox"
															id={`${u.id}-${opt}`}
															name={u.id}
															value={opt}
															onChange={(e) => handleCheckbox(u.id, opt, e.target.checked)}
															onInput={() => {
																setErrors((prev) => ({
																	...prev,
																	[u.id]: "",
																}));
															}}
															aria-describedby={errors[u.id] ? `${u.label} error` : undefined}
															aria-invalid={!!errors[u.id]}
														/>
														<Label htmlFor={`${u.id}-${opt}`} className="cursor-pointer">
															{toSentenceCase(opt)}
														</Label>
													</div>
												))}
											</div>

											{errors[u.id] && <p className="text-sm text-red-500">{errors[u.id]}</p>}
										</div>
									);

								case "select":
									return (
										<div key={u.id} className="w-full">
											<Label htmlFor={u.id}>{u.label}</Label>
											<Select
												name={u.id}
												onValueChange={(value) => {
													setErrors((prev) => ({ ...prev, [u.id]: "" }));
													handleSelect(u.id, value);
												}}
												aria-describedby={errors[u.id] ? `${u.label} error` : undefined}
												aria-invalid={!!errors[u.id]}
											>
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
											{errors[u.id] && <p className="text-sm text-red-500 mt-1">{errors[u.id]}</p>}
										</div>
									);

								case "radio":
									return (
										<div key={u.id}>
											<p className="mb-2 font-medium">{u.label}</p>
											<RadioGroup
												name={u.id}
												onValueChange={(value) => {
													setErrors((prev) => ({
														...prev,
														[u.id]: "",
													}));
													handleRadio(u.id, value);
												}}
												value={radios[u.id]}
												aria-labelledby={`${u.id}-label`}
												aria-describedby={errors[u.id] ? `${u.label} error` : undefined}
												aria-invalid={!!errors[u.id]}
											>
												{u.options.length > 0 &&
													u.options.map((opt) => (
														<div key={opt} className="flex items-center gap-3">
															<RadioGroupItem value={opt} id={`${u.id}-${opt}`} />
															<Label htmlFor={`${u.id}-${opt}`}>{toSentenceCase(opt)}</Label>
														</div>
													))}
											</RadioGroup>
											{errors[u.id] && <p className="text-sm text-red-500 mt-1">{errors[u.id]}</p>}
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
												value={textAreas[u.id] ?? ""}
												onChange={(e) => handleTextArea(u.id, e.target.value)}
											/>
										</div>
									);
								default:
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
												placeholder={`Enter your ${u.label.toLowerCase()}`}
												className="bg-white"
											/>
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
