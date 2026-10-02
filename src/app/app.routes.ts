import { Routes } from '@angular/router';

import { FormsPageComponent } from './forms-page/forms-page.component';
import { TodoComponent } from './todo/todo.component';

export const routes: Routes = [
	{
		path: '',
		component: TodoComponent,
		title: 'Todo Index',
	},
	{
		path: 'forms',
		component: FormsPageComponent,
		title: 'Forms',
	},
];
