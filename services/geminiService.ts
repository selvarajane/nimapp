import { GoogleGenAI, Type } from "@google/genai";
import { Store, InventoryCategory } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateStores = async (location: string = "a bustling city"): Promise<Store[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a list of 8 realistic fictional supermarkets, grocery stores, and daily needs shops located in ${location}. Vary the types (e.g., Organic Market, Convenience Store, Wholesale, Fresh Produce). Make them sound appealing like they belong on a premium fast-delivery grocery app.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: "A unique short alphanumeric ID" },
              name: { type: Type.STRING, description: "Name of the supermarket/store" },
              categories: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Array of 2-3 primary categories they sell (e.g., Groceries, Fresh Produce)"
              },
              rating: { type: Type.NUMBER, description: "Rating out of 5, e.g., 4.6" },
              deliveryTime: { type: Type.STRING, description: "Estimated delivery time, e.g., '10-15 mins'" },
              minOrder: { type: Type.STRING, description: "Minimum order or delivery info, e.g., 'Min ₹150'" },
              offer: { type: Type.STRING, description: "A catchy promotional offer, e.g., '20% OFF Daily Staples'" }
            },
            required: ["id", "name", "categories", "rating", "deliveryTime", "minOrder", "offer"]
          }
        }
      }
    });

    const text = response.text || "[]";
    return JSON.parse(text) as Store[];
  } catch (error) {
    console.error("Error generating stores:", error);
    return [];
  }
};

export const generateInventory = async (storeName: string, categories: string[]): Promise<InventoryCategory[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a comprehensive grocery and supermarket inventory for a fictional store named "${storeName}" that specializes in ${categories.join(", ")}. Include categories like Fresh Vegetables, Dairy & Milk, Snacks, and Household items. Make the products sound realistic.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING, description: "Inventory category name" },
              items: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING, description: "Unique short ID for the item" },
                    name: { type: Type.STRING, description: "Name of the grocery product" },
                    description: { type: Type.STRING, description: "Brief description of the product or brand" },
                    price: { type: Type.NUMBER, description: "Price in Indian Rupees (just the number)" },
                    weight: { type: Type.STRING, description: "Weight or volume, e.g., '1 kg', '500 ml', '1 pack'" },
                    isOrganic: { type: Type.BOOLEAN, description: "True if the product is organic" }
                  },
                  required: ["id", "name", "description", "price", "weight", "isOrganic"]
                }
              }
            },
            required: ["category", "items"]
          }
        }
      }
    });

    const text = response.text || "[]";
    return JSON.parse(text) as InventoryCategory[];
  } catch (error) {
    console.error("Error generating inventory:", error);
    return [];
  }
};

export const suggestGroceries = async (mood: string): Promise<string> => {
   try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a friendly grocery delivery app assistant. The user says their current need is: "${mood}". Suggest 2-3 specific grocery items, snacks, or simple recipes they should order ingredients for, and briefly explain why it fits their need. Keep it under 3 sentences, helpful, and energetic.`,
    });
    return response.text || "Sorry, I couldn't think of anything right now. How about some fresh fruits?";
  } catch (error) {
    console.error("Error suggesting groceries:", error);
    return "Oops, my grocery brain is having a moment. Maybe try adding some snacks?";
  }
}