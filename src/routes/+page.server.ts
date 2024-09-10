import { Resource } from "sst";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({});

export const actions = {
  default: async ({ request }: any) => {
    const formData = await request.formData();
    const content = formData.get('model');
    const imagePrompt = formData.get('imagePrompt');

    if (!content && !imagePrompt) {
      return {
        error: { message: 'Model could not be updated' }
      };
    }

    try {
      const key = 'model.txt';
      const putCommand = new PutObjectCommand({
        Bucket: Resource.MyBucket.name,
        Key: key,
        Body: JSON.stringify({ content, imagePrompt }),
        ContentType: 'application/json'
      });

      await s3Client.send(putCommand);

      return {
        success: { message: 'Model has been updated.' }
      };
    } catch (error) {
      console.error('Error writing to S3:', error);
      return {
        error: { message: 'Failed to update model' }
      };
    }
  }
};

export const load = async () => {
  try {
    const key = 'model.txt';
    const getCommand = new GetObjectCommand({
      Bucket: Resource.MyBucket.name,
      Key: key
    });

    const response = await s3Client.send(getCommand);
    const modelData = await response.Body?.transformToString();

    return {
      model: modelData ? JSON.parse(modelData) : null
    };
  } catch (error) {
    console.error('Error reading from S3:', error);
    return {
      model: null
    };
  }
}