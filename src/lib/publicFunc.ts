import { enhance } from '$app/forms';
import type { SubmitFunction } from '@sveltejs/kit';
import { tick } from 'svelte';

export function enhanceWithLoader(
  form: HTMLFormElement,
  submit?: SubmitFunction
) {
  return enhance(form, (submitData) => {
    let { submitter } = submitData;
    if (submitter) {
      submitter.setAttribute('disabled', "true");
      submitter.classList.add('isLoading');
    }

    let result = submit?.(submitData);

    return async (resultData) => {
      try {
        if (typeof result === 'function') {
          await result(resultData);
        } else {
          await resultData.update();
        }
      } catch (err) {
        console.error(err)
      }
      await tick();
      if (submitter) {
				submitter.removeAttribute('disabled');
				submitter.classList.remove('isLoading');
			};
    };
  });
}
