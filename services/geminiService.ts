// Fix: Use GenerateContentParameters and alias Blob to avoid conflicts.
import { GoogleGenAI, GenerateContentParameters, Modality, Blob as GenaiBlob, LiveCallbacks, FunctionDeclaration, Type } from '@google/genai';
import { Coordinates } from '../types';
import { audioUtils } from '../utils/audio';
import { Language, getLanguageName } from '../utils/translations';

// Helper to convert File object to base64
const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
};

const saveNoteFunctionDeclaration: FunctionDeclaration = {
    name: 'saveNote',
    parameters: {
        type: Type.OBJECT,
        description: 'Saves a text note for the user.',
        properties: {
            content: {
                type: Type.STRING,
                description: 'The content of the note to be saved.',
            },
        },
        required: ['content'],
    },
};

const updateFarmProfileFunctionDeclaration: FunctionDeclaration = {
    name: 'updateFarmProfile',
    parameters: {
        type: Type.OBJECT,
        description: 'Updates a specific field in the user\'s farm profile.',
        properties: {
            field: {
                type: Type.STRING,
                description: 'The profile field to update. Must be one of: "location", "farmSize", "soilType", "waterSource", "currentCrops", "goals".',
            },
            value: {
                 type: Type.STRING,
                 description: 'The new value for the profile field.'
            }
        },
        required: ['field', 'value'],
    },
};

const generateFarmPlanFunctionDeclaration: FunctionDeclaration = {
    name: 'generateFarmPlan',
    parameters: {
        type: Type.OBJECT,
        description: 'Generates a comprehensive farm plan based on the current farm profile data. The plan is then saved for the user to view later. Call this function when the user asks to create a plan.',
        properties: {}, // No properties needed as it uses the existing profile
    },
};


class GeminiService {
    private ai: GoogleGenAI;

    constructor() {
        if (!process.env.API_KEY) {
            console.warn("API_KEY environment variable not set. Using a placeholder key.");
        }
        this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    }

    private getLanguageInstruction(language: Language): string {
        return `\n\n**IMPORTANT**: Your response MUST be entirely in the ${getLanguageName(language)} language.`;
    }

    async generateText({ prompt, file, thinkingMode, coordinates, language }: { prompt: string; file: File | null; thinkingMode: boolean; coordinates: Coordinates | null; language: Language }): Promise<string> {
        const model = thinkingMode ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
        const fullPrompt = prompt + this.getLanguageInstruction(language);
        
        const contents: any[] = [];
        if (file) {
            contents.push(await fileToGenerativePart(file));
        }
        contents.push({ text: fullPrompt });
        
        const req: GenerateContentParameters = {
            model,
            contents: { parts: contents },
            config: {}
        };

        if (coordinates) {
            req.config!.tools = [{ googleMaps: {} }];
            req.config!.toolConfig = {
                retrievalConfig: {
                    latLng: {
                        latitude: coordinates.latitude,
                        longitude: coordinates.longitude
                    }
                }
            };
        }
        
        const response = await this.ai.models.generateContent(req);
        return response.text;
    }

    // Fix: Add analyzeImage method to handle image analysis requests.
    async analyzeImage(file: File, prompt: string, language: Language): Promise<string> {
        const model = 'gemini-2.5-flash';
        const fullPrompt = prompt + this.getLanguageInstruction(language);
        
        const imagePart = await fileToGenerativePart(file);
        
        const response = await this.ai.models.generateContent({
            model,
            contents: { parts: [imagePart, { text: fullPrompt }] },
        });

        return response.text;
    }

    // Fix: Add analyzeVideoFrames method to handle video analysis requests.
    async analyzeVideoFrames(frames: string[], prompt: string, language: Language): Promise<string> {
        const model = 'gemini-2.5-flash';
        const fullPrompt = prompt + this.getLanguageInstruction(language);

        const frameParts = frames.map(frameData => ({
            inlineData: {
                data: frameData,
                mimeType: 'image/jpeg',
            },
        }));
        
        const contents: any[] = [...frameParts, { text: fullPrompt }];

        const response = await this.ai.models.generateContent({
            model,
            contents: { parts: contents },
        });

        return response.text;
    }

    async generateAndPlaySpeech(text: string, language: Language): Promise<void> {
        // TTS might not support all languages, but we can try. Defaulting to a suitable voice.
        const voiceName = language === 'hi' ? 'Kore' : 'Zephyr'; // Example voice selection
        const fullText = `In ${getLanguageName(language)}, say: ${text}`;
        
        const response = await this.ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: fullText }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: { prebuiltVoiceConfig: { voiceName } },
                },
            },
        });
        
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
            const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
            const audioBuffer = await audioUtils.decodeAudioData(audioUtils.decode(base64Audio), outputAudioContext, 24000, 1);
            const source = outputAudioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(outputAudioContext.destination);
            source.start();
        } else {
            throw new Error("No audio data received from API.");
        }
    }

    async transcribeAudio(audioBlob: globalThis.Blob, language: Language): Promise<string> {
        const base64Audio = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(audioBlob);
        });

        const audioPart = {
            inlineData: { data: base64Audio, mimeType: audioBlob.type || 'audio/webm' }
        };
        const prompt = `Transcribe this audio. The speaker is likely speaking in ${getLanguageName(language)}.`;
        
        const response = await this.ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [audioPart, { text: prompt }] },
        });

        return response.text;
    }
    
    startLiveSession(callbacks: LiveCallbacks, language: Language) {
        const langName = getLanguageName(language);
        return this.ai.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-09-2025',
            callbacks,
            config: {
                responseModalities: [Modality.AUDIO],
                outputAudioTranscription: {},
                inputAudioTranscription: {},
                tools: [{ functionDeclarations: [saveNoteFunctionDeclaration, updateFarmProfileFunctionDeclaration, generateFarmPlanFunctionDeclaration] }],
                speechConfig: {
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
                },
                systemInstruction: `You are Kisan AI, a friendly AI assistant for Indian farmers. 
                
                Your primary goal is to have a natural, helpful conversation.
                
                1.  **Media First**: If the user provides an image or video frames at the beginning of the conversation, your first task is to analyze the media. Describe what you see, and if it's farm-related, look for signs of plant health, pests, diseases, or soil conditions. Ask clarifying questions about the media. For example: "I see an image of a wheat plant with some yellow spots on the leaves. Would you like me to identify potential causes?".
                
                2.  **Profile Building**: If the user does not provide media, your goal is to help them create a farm profile by asking them questions one by one. Start by greeting them and then ask for their location. Wait for their answer before asking the next question (farm size, soil type, water source, current crops, goals). Use the 'updateFarmProfile' tool immediately after they provide a piece of information.
                
                3.  **Tool Usage**: If the user asks you to generate a plan, use the 'generateFarmPlan' tool. This will create a detailed plan based on the collected profile and save it to their notes. If the user asks you to save something unrelated to the profile, use the 'saveNote' tool. 
                
                Keep your responses concise and clear.
                **VERY IMPORTANT**: You MUST conduct the entire conversation in the ${langName} language. All your spoken responses and text transcriptions must be in ${langName}.`,
            }
        });
    }

    createAudioBlob(data: Float32Array): GenaiBlob {
        const l = data.length;
        const int16 = new Int16Array(l);
        for (let i = 0; i < l; i++) {
            int16[i] = data[i] * 32768;
        }
        return {
            data: audioUtils.encode(new Uint8Array(int16.buffer)),
            mimeType: 'audio/pcm;rate=16000',
        };
    }

    async generateFarmPlan(profile: any, language: Language): Promise<string> {
        const langName = getLanguageName(language);
        const prompt = `
            Based on the following farm profile, create a comprehensive and actionable farm plan for an Indian farmer.
            The plan should be practical, sustainable, and tailored to the provided details.
            Include recommendations for crop selection, a timeline/calendar, soil management, irrigation, pest/disease control, and potential government schemes to look into.
            
            Farm Profile:
            - Location: ${profile.location}
            - Farm Size: ${profile.farmSize} acres
            - Soil Type: ${profile.soilType}
            - Water Source: ${profile.waterSource}
            - Current Crops: ${profile.currentCrops}
            - Goals: ${profile.goals}
            
            **VERY IMPORTANT**: The entire generated plan MUST be in the ${langName} language.
        `;

        const response = await this.ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
        });

        return response.text;
    }
}

export const geminiService = new GeminiService();