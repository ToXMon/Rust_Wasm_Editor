// Venice API Configuration
const CONFIG = {
    VENICE_API_KEY: 'lLGsoQ7u8BMjfs3I4FaQRuhP9ILU-xJVL11VKnt0Ky', // Replace with your actual API key
    VENICE_API_BASE: 'https://api.venice.ai/api/v1',
    MODELS: {
        VISION: 'qwen-2.5-vl', // Model with vision capabilities
        REASONING: 'qwen-2.5-qwq-32b', // Model with reasoning capabilities
        CODING: 'qwen-2.5-coder-32b' // Model optimized for coding
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
