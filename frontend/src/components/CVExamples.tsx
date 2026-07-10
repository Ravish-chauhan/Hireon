import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resumeService } from '../services/resumeService';

const CVExamples: React.FC = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const data = await resumeService.getTemplates();
      setTemplates(data.slice(4, 6));
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const handleTemplateClick = (templateId: string) => {
    navigate(`/resume-editor/${templateId}`);
  };

  return (
    <div className="py-16 bg-gradient-to-b from-white to-cream-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Looking for CVs or cover letters?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Explore our extensive collection of CV and cover letter examples to find your perfect fit for any industry or job level.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {templates.map((template) => (
            <div key={template._id} className="group relative text-center cursor-pointer" onClick={() => handleTemplateClick(template._id)}>
              <div className="rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-2xl transition-shadow">
                <img src={template.previewImage} alt={template.name} className="w-full h-auto object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="px-6 py-3 bg-gradient-to-r from-brand-600 to-orange-600 text-white rounded-lg font-medium">
                    Use Template
                  </button>
                </div>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">{template.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CVExamples;
