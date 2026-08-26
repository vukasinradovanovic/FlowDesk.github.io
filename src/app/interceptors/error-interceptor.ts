import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
	return next(req).pipe(
		catchError((error: HttpErrorResponse) => {
			console.group(`❌ HTTP Error [${error.status}] - ${req.url}`);

			if (error.status === 422) {
				// FluentValidation errors matching your middleware output: [{ error: "...", property: "..." }]
				console.error('Validation Errors (422):', error.error);
				if (Array.isArray(error.error)) {
					error.error.forEach((err: { property: string; error: string }) => {
						console.error(`  • [${err.property}]: ${err.error}`);
					});
				}
			} else if (error.status === 401) {
				console.error('Unauthorized Access (401): You do not have permission for this operation.');
			} else if (error.status === 500) {
				// Internal Server Error with Support Log ID
				console.error('Server Error (500):', error.error?.message || error.message);
			} else {
				console.error('Unexpected Error:', error.error);
			}

			console.groupEnd();

			// Pass the error along to the component if needed
			return throwError(() => error);
		}),
	);
};
