<script lang="ts">
  import { Textarea, Toolbar, ToolbarGroup, ToolbarButton, Button, Heading, Alert } from 'flowbite-svelte';
  import { PaperClipOutline, MapPinAltSolid, ImageOutline } from 'flowbite-svelte-icons';
  import type { ActionData, PageData } from './$types';



    export let form: ActionData;
    export let data: PageData;
</script>
<div class="mt-4">
  <!-- svelte-ignore missing-declaration -->
  <Heading tag="h5">Set Model Content</Heading>
  <form method="POST">
    <Textarea class="mb-4" placeholder="..." name="model">
      <div slot="footer" class="flex items-center justify-between">
        <Button type="submit">Save Content</Button>
      </div>
    </Textarea>
  </form> 
  {#if form?.error || form?.success}
  <Alert border color="{form.error? 'red' : 'green'}" class="mb-4">
    {form.error? form.error.message : form.success.message}
  </Alert>
  {/if}
</div>