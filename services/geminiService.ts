
import { GoogleGenAI } from "@google/genai";

export async function generateCyberpunkImage(prompt: string): Promise<string> {
  // Ensure API key is available
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    console.log("Requesting image generation with prompt:", prompt);
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png', // Use PNG for better quality
        aspectRatio: '9:16', // Tall aspect ratio for towering cityscapes
      },
    });

    console.log("Received response from Gemini API.");
    
    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      if (base64ImageBytes) {
        return `data:image/png;base64,${base64ImageBytes}`;
      }
    }
    
    throw new Error("No image was generated. The response may have been blocked.");

  } catch (error) {
    console.error("Error generating image with Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error("An unknown error occurred during image generation.");
  }
}
