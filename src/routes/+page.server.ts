import fs from 'fs';

export const actions = {
  default: async ({ request, params }) => {
    const formData = await request.formData();
    const model = formData.get('model');

    if(!model) {
      return {
        error: { message: 'Model could not be updated' }
      };
    }

    const result = fs.writeFileSync('./lib/model.txt', JSON.stringify({ content: model }), 'utf-8');
    console.log(result)
    const json = { content: model }
    return {
      success: { message: 'Model has been updated.' }
    }
    // TODO log the user in
  }
};  