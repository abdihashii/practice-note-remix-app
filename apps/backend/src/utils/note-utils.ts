// Third-party imports
import type { CreateNoteDto, UpdateNoteDto } from '@notes-app/types';
import type { ValidationError } from '../types/error-types';

/**
 * Validates note data for both create and update operations
 */
function validateNoteData(data: Partial<CreateNoteDto>): ValidationError[] {
	const errors: ValidationError[] = [];

	if (data.title !== undefined) {
		if (!data.title?.trim()) {
			errors.push({
				field: 'title',
				message: 'Title cannot be empty',
				code: 'INVALID_INPUT',
			});
		} else if (data.title.length > 255) {
			errors.push({
				field: 'title',
				message: 'Title must be less than 255 characters',
				code: 'INVALID_LENGTH',
				params: { max: 255, current: data.title.length },
			});
		}
	}

	if (data.content !== undefined && data.content.length > 10000) {
		errors.push({
			field: 'content',
			message: 'Content must be less than 10000 characters',
			code: 'INVALID_LENGTH',
			params: { max: 10000, current: data.content.length },
		});
	}

	return errors;
}

/**
 * Validates data for creating a new note
 */
export function validateCreateNote(data: CreateNoteDto): ValidationError[] {
	if (!data.title?.trim()) {
		return [
			{
				field: 'title',
				message: 'Title is required',
				code: 'REQUIRED_FIELD',
			},
		];
	}
	return validateNoteData(data);
}

/**
 * Validates data for updating an existing note
 */
export function validateUpdateNote(data: UpdateNoteDto): ValidationError[] {
	return validateNoteData(data);
}
