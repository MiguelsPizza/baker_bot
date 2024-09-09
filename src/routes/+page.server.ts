import fs from 'fs';
import path from 'path';

export const actions = {
  default: async ({ request, params }: any) => {
    const formData = await request.formData();
    const model = formData.get('model');

    if (!model) {
      return {
        error: { message: 'Model could not be updated' }
      };
    }

    const filePath = './lib/model.txt';
    const dirPath = path.dirname(filePath);

    try {
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      fs.writeFileSync(filePath, JSON.stringify({ content: model }), 'utf-8');

      return {
        success: { message: 'Model has been updated.' }
      };
    } catch (error) {
      console.error('Error writing file:', error);
      return {
        error: { message: 'Failed to update model' }
      };
    }
  }
};