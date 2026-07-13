require('@babel/register')({
  presets: [
    '@babel/preset-env',
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript'
  ],
  extensions: ['.js', '.jsx', '.ts', '.tsx']
});

const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { MemoryRouter } = require('react-router-dom');

const { FinalDraftPage } = require('./src/pages/FinalDraftPage');
const { ResumeProvider } = require('./src/context/ResumeContext');

console.log('Rendering FinalDraftPage...');

const App = () => (
  React.createElement(MemoryRouter, null, 
    React.createElement(ResumeProvider, null, 
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
