const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { MemoryRouter } = require('react-router-dom');

const { FinalDraftPage } = require('./src/pages/FinalDraftPage');
const { ResumeContext } = require('./src/context/ResumeContext');

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

const App = () => (
  React.createElement(MemoryRouter, null, 
    React.createElement(ResumeContext.Provider, { value: mockContextValue }, 
      React.createElement(FinalDraftPage, null)
    )
  )
);

try {
  const html = ReactDOMServer.renderToString(React.createElement(App, null));
  console.log('Successfully rendered! HTML length:', html.length);
} catch (error) {
  console.error('RENDER FAILED!');
  console.error(error);
}

export {};
