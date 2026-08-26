import { Injectable } from '@angular/core';

export interface Status {
  name: string;
  theme: string;
}

@Injectable({
	providedIn: 'root',
})
export class Status {}
