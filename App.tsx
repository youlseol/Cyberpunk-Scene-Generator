
import React, { useState, useCallback } from 'react';
import { generateCyberpunkImage } from './services/geminiService';

const initialPrompt = `In a bustling, cyberpunk urban landscape, vibrant neon lights and holographic advertisements illuminate the damp, reflective surfaces of towering buildings and intricate walkways, creating a chaotic yet beautiful atmosphere; the main character, a young thin woman, wears a black, slim, form-fitting leather coat that tapers neatly at the waist. Her hair is black, straight, and shoulder-length. Her lower body is dressed in a short skirt or fitted shorts, paired with tall boots that extend to just below the knee, emphasizing a sleek outline. The neon glow from the billboards and signs reflects faintly off the glossy surfaces of her outfit, giving her figure a subtle edge of light, embodying a readiness to navigate this intricately designed, dense cityscape filled with illuminated billboards and elevated paths.`;

const Spinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center gap-4">
    <svg
      className="animate-spin h-12 w-12 text-cyan-400"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    <p className="text-lg text-cyan-300 font-mono tracking-widest animate-pulse">
      GENERATING IMAGE...
    </p>
  </div>
);

const Placeholder: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 className="text-xl font-semibold">Cyberpunk Vision Awaits</h3>
        <p className="mt-2 max-w-sm">Your generated image will appear here. Modify the prompt and hit 'Generate' to create a new scene.</p>
    </div>
);


const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>(initialPrompt);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateImage = useCallback(async () => {
    if (!prompt || isLoading) return;
    setIsLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const url = await generateCyberpunkImage(prompt);
      setImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, isLoading]);

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200 flex flex-col items-center p-4 sm:p-8 font-sans">
      <header className="w-full max-w-6xl mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-cyan-400 tracking-widest" style={{ textShadow: '0 0 10px #22d3ee, 0 0 20px #22d3ee' }}>
          CYBERPUNK VISION ENGINE
        </h1>
        <p className="text-gray-400 mt-2">Crafting neon-drenched futures from your words</p>
      </header>
      
      <main className="w-full max-w-6xl flex flex-col lg:flex-row gap-8">
        {/* Left Panel: Controls */}
        <div className="lg:w-1/2 flex flex-col gap-4 p-6 bg-gray-800/50 border border-cyan-500/30 rounded-lg shadow-lg" style={{ boxShadow: '0 0 15px rgba(34, 211, 238, 0.1)'}}>
          <label htmlFor="prompt" className="text-2xl font-semibold text-cyan-400">
            Scene Prompt
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-80 flex-grow bg-gray-900 border border-gray-600 rounded-md p-4 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-300 resize-none"
            placeholder="Describe the cyberpunk scene you want to generate..."
          />
          <button
            onClick={handleGenerateImage}
            disabled={isLoading}
            className="w-full py-3 px-6 bg-cyan-500 text-gray-900 font-bold text-lg rounded-md hover:bg-cyan-400 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100 flex items-center justify-center gap-2"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)', boxShadow: '0 0 10px #22d3ee, 0 0 5px #22d3ee' }}
          >
            {isLoading ? 'Generating...' : 'Generate Image'}
          </button>
        </div>
        
        {/* Right Panel: Output */}
        <div className="lg:w-1/2 flex items-center justify-center p-6 bg-gray-800/50 border border-cyan-500/30 rounded-lg min-h-[400px] lg:min-h-0">
            <div className="w-full h-full flex items-center justify-center">
                {isLoading && <Spinner />}
                {error && (
                    <div className="text-center bg-red-900/50 border border-red-500 text-red-300 p-4 rounded-md">
                        <h3 className="font-bold text-lg">Error Generating Image</h3>
                        <p>{error}</p>
                    </div>
                )}
                {!isLoading && !error && imageUrl && (
                    <img src={imageUrl} alt="Generated cyberpunk scene" className="rounded-lg shadow-2xl object-contain max-w-full max-h-full" style={{ boxShadow: '0 0 25px rgba(34, 211, 238, 0.3)'}} />
                )}
                {!isLoading && !error && !imageUrl && (
                   <Placeholder />
                )}
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;
