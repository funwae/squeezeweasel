/**
 * LLM Gateway - abstraction layer for LLM providers
 */

import { OpenAI } from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config/index.js";

export interface LLMCallOptions {
  model: string;
  systemPrompt?: string;
  userPrompt: string;
  temperature?: number;
}

export class LLMGateway {
  private openai: OpenAI | null = null;
  private gemini: GoogleGenerativeAI | null = null;

  constructor() {
    if (config.llm.openaiApiKey) {
      this.openai = new OpenAI({
        apiKey: config.llm.openaiApiKey,
      });
    }

    if (config.llm.geminiApiKey) {
      this.gemini = new GoogleGenerativeAI(config.llm.geminiApiKey);
    }
  }

  async call(options: LLMCallOptions): Promise<string> {
    const model = options.model.toLowerCase();

    if (model.startsWith("gpt") || model.startsWith("openai")) {
      return this.callOpenAI(options);
    }

    if (model.startsWith("gemini") || model.startsWith("google")) {
      return this.callGemini(options);
    }

    // Default to OpenAI if available
    if (this.openai) {
      return this.callOpenAI(options);
    }

    throw new Error(`No LLM provider available for model: ${options.model}`);
  }

  private async callOpenAI(options: LLMCallOptions): Promise<string> {
    if (!this.openai) {
      throw new Error("OpenAI API key not configured");
    }

    const messages: Array<{ role: "system" | "user"; content: string }> = [];

    if (options.systemPrompt) {
      messages.push({ role: "system", content: options.systemPrompt });
    }

    messages.push({ role: "user", content: options.userPrompt });

    const response = await this.openai.chat.completions.create({
      model: options.model.startsWith("gpt") ? options.model : "gpt-4",
      messages,
      temperature: options.temperature || 0.7,
    });

    return response.choices[0]?.message?.content || "";
  }

  private async callGemini(options: LLMCallOptions): Promise<string> {
    if (!this.gemini) {
      throw new Error("Gemini API key not configured");
    }

    const modelName = options.model.includes("gemini")
      ? options.model
      : "gemini-pro";

    const model = this.gemini.getGenerativeModel({ model: modelName });

    let prompt = options.userPrompt;
    if (options.systemPrompt) {
      prompt = `${options.systemPrompt}\n\n${options.userPrompt}`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }
}

