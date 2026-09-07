import { Injectable } from '@angular/core';

export interface Attachments {
	id: number;
	originalFileName: string;
	filePath: string;
	fileSize: number;
	uploadedAt: Date;
}

@Injectable({
	providedIn: 'root',
})
export class Attachments {}
