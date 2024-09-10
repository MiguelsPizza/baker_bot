<script lang="ts">
  import { Textarea, Button, Heading, Alert } from 'flowbite-svelte';
  import type { ActionData, PageData } from './$types';

  export let form: ActionData;
  export let data: PageData;
</script>

<div class="mt-4">
  <Heading tag="h5">Set Model Content</Heading>
  <form method="POST">
    <Textarea class="mb-4" rows={8} placeholder="Enter model content..." name="model" value={data.model?.content || ''} />
    <Textarea class="mb-4" rows={4} placeholder="Enter image prompt..." name="imagePrompt" value={data.model?.imagePrompt || ''} />
    <Button type="submit">Save Content</Button>
  </form>
  {#if form?.error || form?.success}
    <Alert border color="{form.error ? 'red' : 'green'}" class="mt-4">
      {form.error ? form.error.message : form.success.message}
    </Alert>
  {/if}
</div>