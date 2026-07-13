require('@babel/register')({
  presets: ['@babel/preset-env', ['@babel/preset-react', { runtime: 'automatic' }], '@babel/preset-typescript'],
  extensions: ['.js', '.jsx', '.ts', '.tsx']
});

const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { MemoryRouter } = require('react-router-dom');

// Mock ResumeContext
const { ResumeContext } = require('./src/context/ResumeContext');

// Mock lucide-react if needed, or let it load natively
// It's already in node_modules

try {
  const { FinalDraftPage } = require('./src/pages/FinalDraftPage');

  const templateData = {
    personalInfo: { name: 'John Doe', contact: {} },
    education: [],
    experience: [],
    skills: [],
    projects: []
  };

  const mockContextValue = {
    templateData,
    selectedTemplate: 'template-1',
    setSelectedTemplate: () => {}
  };

  console.log('Rendering FinalDraftPage...');
  
  // We mock a wrapper
  const App = () => (
    <MemoryRouter>
      <ResumeContext.Provider value={mockContextValue}>
        <FinalDraftPage />
      </ResumeContext.Provider>
    </MemoryRouter>
  );

  const html = ReactDOMServer.renderToString(<App />);
  console.log('Successfully rendered! HTML length:', html.length);
} catch (error) {
  console.error('RENDER FAILED!');
  console.error(error);
}
