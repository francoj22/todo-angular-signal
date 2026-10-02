import { Component, computed, signal } from '@angular/core';
import { FormField, form, required, submit } from '@angular/forms/signals';

interface ReleaseFormValue {
  releaseName: string;
  owner: string;
  notes: string;
}

const EMPTY_RELEASE_FORM: ReleaseFormValue = {
  releaseName: '',
  owner: '',
  notes: '',
};

@Component({
  selector: 'app-forms-page',
  standalone: true,
  imports: [FormField],
  templateUrl: './forms-page.component.html',
  styleUrl: './forms-page.component.scss',
})
export class FormsPageComponent {
  protected readonly model = signal<ReleaseFormValue>({
    releaseName: 'October release',
    owner: 'Product team',
    notes: 'Confirm QA approval, deployment window, and rollback checklist.',
  });

  protected readonly form = form(this.model, (path) => {
    required(path.releaseName, { message: 'Release name is required.' });
    required(path.owner, { message: 'Owner is required.' });
    required(path.notes, { message: 'Release notes are required.' });
  });

  protected readonly submittedRelease = signal<ReleaseFormValue>({
    ...this.model(),
  });

  protected readonly isSubmitting = signal(false);

  protected readonly canSubmit = computed(() => {
    return !this.form().invalid() && !this.isSubmitting();
  });

  protected async submitForm(event: Event): Promise<void> {
    event.preventDefault();

    this.isSubmitting.set(true);

    try {
      const submitted = await submit(this.form, (field) => {
        this.submittedRelease.set({
          ...field().value(),
        });

        return Promise.resolve(undefined);
      });

      if (submitted) {
        this.form().reset(EMPTY_RELEASE_FORM);
        window.alert('Submitted successfully.');
      }
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
