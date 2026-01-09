import { NextRequest, NextResponse } from 'next/server';

// Mock AI responses based on persona and context
function generateMockResponse(
  message: string,
  mode: 'developer' | 'designer' | 'mentor' | 'career' = 'career',
  history: any[] = []
): string {
  const lowerMessage = message.toLowerCase();

  // Career mode responses
  if (mode === 'career' || mode === 'mentor') {
    if (lowerMessage.includes('resume') || lowerMessage.includes('cv')) {
      return `Great question! For your resume, I'd recommend:

1. **Quantify achievements**: Use numbers and metrics to show impact
2. **Tailor for the role**: Customize your resume for each application
3. **Highlight relevant skills**: Match keywords from job descriptions
4. **Keep it concise**: Aim for 1-2 pages maximum
5. **Use action verbs**: Start bullet points with strong verbs like "Led", "Built", "Optimized"

Would you like specific feedback on your resume or help tailoring it for a particular role?`;
    }

    if (lowerMessage.includes('placement') || lowerMessage.includes('interview')) {
      return `For placement preparation, focus on:

1. **Technical Skills**: Practice coding problems on platforms like LeetCode, HackerRank
2. **System Design**: Understand scalability, databases, and architecture patterns
3. **Behavioral Questions**: Prepare STAR method stories for common questions
4. **Mock Interviews**: Practice with peers or use platforms like Pramp
5. **Portfolio Projects**: Be ready to explain your projects in detail

I can help you prepare for specific companies or roles. What would you like to focus on?`;
    }

    if (lowerMessage.includes('project') || lowerMessage.includes('placementprep')) {
      return `The PlacementPrep project is a comprehensive platform designed to help students prepare for technical interviews. It includes:

- **Practice Problems**: Curated coding challenges
- **Mock Interviews**: Simulated interview experiences
- **Progress Tracking**: Monitor your preparation journey
- **Resource Library**: Study materials and tips

Built with modern technologies like React, Node.js, and MongoDB. Would you like to know more about the technical implementation or specific features?`;
    }

    if (lowerMessage.includes('leadership') || lowerMessage.includes('team')) {
      return `Leadership experience is crucial for career growth. Key aspects include:

1. **Communication**: Clear, effective communication with team members
2. **Decision Making**: Making informed decisions under pressure
3. **Mentorship**: Guiding and supporting junior developers
4. **Project Management**: Organizing tasks and timelines
5. **Conflict Resolution**: Handling disagreements constructively

I can help you articulate your leadership experiences for interviews or resumes. What specific leadership scenario would you like to discuss?`;
    }
  }

  // Developer mode responses
  if (mode === 'developer') {
    if (lowerMessage.includes('tech stack') || lowerMessage.includes('technology')) {
      return `My tech stack includes:

**Frontend**: React, Next.js, TypeScript, Tailwind CSS
**Backend**: Node.js, Express, Python, Flask
**Databases**: MongoDB, PostgreSQL, Redis
**AI/ML**: TensorFlow, PyTorch, OpenAI API
**DevOps**: Docker, AWS, CI/CD pipelines
**Tools**: Git, VS Code, Postman

I'm always learning and exploring new technologies. What specific technology would you like to know more about?`;
    }

    if (lowerMessage.includes('ai') || lowerMessage.includes('machine learning')) {
      return `I have experience with AI/ML including:

- **NLP**: Natural Language Processing for chatbots and text analysis
- **Computer Vision**: Image recognition and processing
- **Deep Learning**: Neural networks with TensorFlow and PyTorch
- **LLM Integration**: Working with OpenAI, Anthropic APIs
- **MLOps**: Deploying and managing ML models in production

I've built several AI-powered applications including this AI assistant! What aspect of AI interests you?`;
    }

    if (lowerMessage.includes('system design') || lowerMessage.includes('architecture')) {
      return `For system design, I focus on:

1. **Scalability**: Horizontal vs vertical scaling, load balancing
2. **Database Design**: SQL vs NoSQL, indexing, replication
3. **Caching**: Redis, CDN, in-memory caching strategies
4. **API Design**: RESTful principles, GraphQL, rate limiting
5. **Security**: Authentication, authorization, encryption
6. **Monitoring**: Logging, metrics, alerting systems

Would you like to discuss a specific system design problem or architecture pattern?`;
    }
  }

  // Designer mode responses
  if (mode === 'designer') {
    if (lowerMessage.includes('ui') || lowerMessage.includes('ux') || lowerMessage.includes('design')) {
      return `My design approach focuses on:

1. **User-Centered Design**: Understanding user needs and pain points
2. **Accessibility**: WCAG guidelines, keyboard navigation, screen readers
3. **Visual Hierarchy**: Clear information architecture and typography
4. **Responsive Design**: Mobile-first approach, breakpoints
5. **Design Systems**: Consistent components and patterns
6. **Prototyping**: Figma, user flows, wireframes

I believe good design is invisible - users shouldn't have to think about how to use an interface. What design challenge are you working on?`;
    }
  }

  // Default response
  return `Thanks for your question! I'm here to help with:

- Career advice and resume feedback
- Technical questions about projects and technologies
- System design and architecture discussions
- Interview preparation tips
- Portfolio and project explanations

Could you be more specific about what you'd like to know? I can provide detailed guidance based on your needs.`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history = [], mode = 'career', sessionId, userName, agentMode } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate response based on mode and message
    const response = generateMockResponse(message, mode, history);

    // Generate or reuse session ID
    const newSessionId = sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return NextResponse.json({
      response,
      sessionId: newSessionId,
    });
  } catch (error: any) {
    console.error('AI Chat API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

