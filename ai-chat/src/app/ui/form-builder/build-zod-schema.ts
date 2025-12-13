import { z } from "zod";
import { UIType } from "./form-builder-client";

export function buildZodSchema(uiFields: UIType[]) {
	const shape: Record<string, any> = {};

	uiFields.forEach((field) => {
		let validator;

		switch (field.component) {
			case "text":
			case "text-area":
				validator = z.string();
				if (field.required) validator = validator.min(1, `${field.label} is required`);
				else validator = validator.optional();
				break;

			case "number":
				validator = z.number();
				if (!field.required) validator = validator.optional();
				break;

			case "checkbox":
				validator = z.boolean();
				if (!field.required) validator = validator.optional();
				break;

			case "date":
				validator = z.string();
				if (!field.required) validator = validator.optional();
				break;

			case "file":
				validator = z.string();
				if (!field.required) validator = validator.optional();
				break;

			case "select":
			case "radio":
				validator = z.enum(field.options);
				if (!field.required) validator = validator.optional();
				break;
		}

		shape[field.id] = validator;
	});

	return z.object(shape);
}
