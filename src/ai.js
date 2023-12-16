import { config } from "dotenv"
import { GoogleGenerativeAI } from "@google/generative-ai"
config()

const genAI = new GoogleGenerativeAI(process.env.API_KEY)

export async function generate(prompt) {

  const model = genAI.getGenerativeModel({ model: "gemini-pro"})

  const result = await model.generateContent(prompt)
  const response = await result.response
  const text = response.text()
  return text
}
