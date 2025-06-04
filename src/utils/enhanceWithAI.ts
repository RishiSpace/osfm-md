export async function enhanceWithAI(content: string): Promise<string> {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [
          {
            role: 'system',
            content: 'You are an AI in a markdown notes app. You will be given the contents of a markdown file and your job is to enhance it and improve the quality of the file. Don\'t shy away from using as many markdown language features as possible to make it look pretty and also enhance the content. Add relevant sections, improve formatting, and expand on the ideas while maintaining the original meaning.'
          },
          {
            role: 'user',
            content
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to enhance content');
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  } catch (error: any) {
    console.error('Error enhancing content:', error);
    throw new Error(`Failed to enhance content: ${error.message || 'Unknown error'}`);
  }
}