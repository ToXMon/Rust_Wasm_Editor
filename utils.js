async function extractFrames(videoElement) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const frames = [];
    
    // Set canvas size to match video
    canvas.width = videoElement.videoWidth || 640;
    canvas.height = videoElement.videoHeight || 360;
    
    // Extract frames at regular intervals
    const duration = videoElement.duration;
    const frameCount = Math.min(10, Math.floor(duration)); // Extract up to 10 frames
    
    for (let i = 0; i < frameCount; i++) {
        const time = (i / frameCount) * duration;
        
        // Seek to specific time
        videoElement.currentTime = time;
        
        // Wait for video to seek
        await new Promise(resolve => {
            videoElement.addEventListener('seeked', resolve, { once: true });
        });
        
        // Draw frame to canvas
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        
        // Convert to base64 image data
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        
        frames.push({
            time: time,
            imageData: imageData
        });
    }
    
    return frames;
}

async function detectScenes(frames) {
    // Use Venice API to analyze frames and detect scenes
    const prompt = `Analyze these ${frames.length} video frames and detect scene changes. For each scene change, return the timestamp and a brief description. Return as JSON with format: {"scenes": [{"time": timestamp, "description": "scene description"}]}`;
    
    const response = await fetch(`${CONFIG.VENICE_API_BASE}/chat/completions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CONFIG.VENICE_API_KEY}`
        },
        body: JSON.stringify({
            model: CONFIG.MODELS.VISION,
            messages: [
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: prompt },
                        ...frames.map(frame => ({
                            type: 'image_url',
                            image_url: { url: frame.imageData }
                        }))
                    ]
                }
            ],
            max_tokens: 1000
        })
    });

    const data = await response.json();
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
        try {
            const result = JSON.parse(data.choices[0].message.content);
            return result.scenes || [];
        } catch (e) {
            // If parsing fails, create mock scenes from frame timestamps
            return frames.slice(1).map((frame, index) => ({
                time: frame.time,
                description: `Scene ${index + 1}`
            }));
        }
    }
    
    return [];
}

async function getTrimSuggestions(frames) {
    // Make an API call to get trim suggestions based on frames
    const response = await fetch('https://api.venice.ai/trims/suggest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'lLGsoQ7u8BMjfs3I4FaQRuhP9ILU-xJVL11VKnt0Ky'
        },
        body: JSON.stringify({ frames: frames, model: 'qwen-2.5-vl' })
    });

    const data = await response.json();
    return data.suggestions;
}

function markScenesOnTimeline(scenes, duration) {
    const timelineBar = document.querySelector('.timeline-bar');

    scenes.forEach(scene => {
        const marker = document.createElement('div');
        marker.className = 'scene-marker';
        marker.style.left = `${(scene.time / duration) * 100}%`;
        timelineBar.appendChild(marker);
    });
}

function displayTrimSuggestions(suggestions) {
    const suggestionContainer = document.createElement('div');
    suggestionContainer.className = 'ai-controls';
    document.querySelector('.controls').appendChild(suggestionContainer);

    suggestions.forEach(suggestion => {
        const suggestionElement = document.createElement('div');
        suggestionElement.className = 'ai-suggestion';
        suggestionElement.textContent = `Trim from ${formatTime(suggestion.start)} to ${formatTime(suggestion.end)}`;

        suggestionElement.addEventListener('click', () => {
            document.getElementById('startTime').value = suggestion.start;
            document.getElementById('endTime').value = suggestion.end;
        });

        suggestionContainer.appendChild(suggestionElement);
    });
}

