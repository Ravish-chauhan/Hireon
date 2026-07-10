import { TemplateResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';

interface ResumeTemplate11Props {
    data: TemplateResumeData;
}

// Modern Gradient - Creative Tech Template
const ResumeTemplate11 = ({ data }: ResumeTemplate11Props) => {
    return (
        <div className="resume-page bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Header with gradient accent */}
            <div className="h-2 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600" />

            <div style={{ padding: 'var(--margin-y, 2rem) var(--margin-x, 2.5rem)' }}>
                {/* Header */}
                <header className="mb-8">
                    <div className="flex items-center gap-6">
                        {data.personalInfo?.image && (
                            <img
                                src={data.personalInfo.image}
                                alt={data.personalInfo?.name || 'Profile'}
                                className="w-20 h-20 rounded-2xl object-cover shadow-lg"
                            />
                        )}
                        <div className="flex-1">
                            <h1 className="text-[32px] font-bold text-gray-900 leading-none mb-1">
                                {data.personalInfo?.name || 'Your Name'}
                            </h1>
                            <p className="text-[16px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
                                {data.personalInfo?.title || 'Professional Title'}
                            </p>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="mt-5 flex flex-wrap gap-4 text-[11px] text-gray-600">
                        {data.personalInfo?.contact?.email && (
                            <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full">
                                <Mail className="w-3.5 h-3.5 text-violet-600" /> {data.personalInfo.contact.email}
                            </span>
                        )}
                        {data.personalInfo?.contact?.phone && (
                            <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full">
                                <Phone className="w-3.5 h-3.5 text-violet-600" /> {data.personalInfo.contact.phone}
                            </span>
                        )}
                        {data.personalInfo?.contact?.location && (
                            <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full">
                                <MapPin className="w-3.5 h-3.5 text-violet-600" /> {data.personalInfo.contact.location}
                            </span>
                        )}
                        {data.personalInfo?.contact?.linkedin && (
                            <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full">
                                <Linkedin className="w-3.5 h-3.5 text-violet-600" /> {data.personalInfo.contact.linkedin}
                            </span>
                        )}
                        {data.personalInfo?.contact?.github && (
                            <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full">
                                <Github className="w-3.5 h-3.5 text-violet-600" /> {data.personalInfo.contact.github}
                            </span>
                        )}
                    </div>
                </header>

                {/* Summary */}
                {data.summary && (
                    <section className="mb-6 bg-gradient-to-r from-violet-50 to-indigo-50 p-4 rounded-xl border-l-4 border-violet-600">
                        <div className="text-[12px] leading-[1.7] text-gray-700" dangerouslySetInnerHTML={{ __html: data.summary }} />
                    </section>
                )}

                {/* Two Column Layout */}
                <div className="flex gap-8">
                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Experience */}
                        {data.experience && data.experience.length > 0 && (
                            <section className="mb-6">
                                <h2 className="text-[13px] font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                                    <span className="w-8 h-0.5 bg-gradient-to-r from-violet-600 to-indigo-600" />
                                    Experience
                                </h2>
                                {data.experience.map((exp, index) => (
                                    <div key={exp.id} className="mb-5 relative pl-4 border-l-2 border-gray-200">
                                        <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600" />
                                        <div className="flex justify-between items-start mb-1">
                                            <div>
                                                <h3 className="text-[14px] font-bold text-gray-900">{exp.title}</h3>
                                                <p className="text-[12px] text-violet-600 font-semibold">{exp.company}</p>
                                            </div>
                                            <p className="text-[10px] text-gray-500 font-medium">{exp.startDate} – {exp.endDate}</p>
                                        </div>
                                        {exp.description && exp.description.length > 0 && (
                                            <ul className="mt-2 space-y-1">
                                                {exp.description.map((desc, i) => (
                                                    <li key={i} className="text-[11px] text-gray-600 leading-relaxed flex gap-2">
                                                        <span className="text-violet-400 mt-0.5">›</span> {desc}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </section>
                        )}

                        {/* Projects */}
                        {data.projects && data.projects.length > 0 && (
                            <section className="mb-6">
                                <h2 className="text-[13px] font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                                    <span className="w-8 h-0.5 bg-gradient-to-r from-violet-600 to-indigo-600" />
                                    Projects
                                </h2>
                                {data.projects.map((proj) => (
                                    <div key={proj.id} className="mb-4 p-3 bg-gray-50 rounded-lg">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-[13px] font-bold text-gray-900">{proj.name}</h3>
                                            {proj.link && <Globe className="w-3.5 h-3.5 text-violet-600" />}
                                        </div>
                                        <p className="text-[11px] text-gray-600 mt-1">
                                            {Array.isArray(proj.description) ? proj.description[0] : proj.description}
                                        </p>
                                        {proj.technologies && (
                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                {proj.technologies.map((tech, i) => (
                                                    <span key={i} className="text-[9px] px-2 py-0.5 bg-violet-100 text-violet-700 rounded font-medium">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="w-[2.2in]">
                        {/* Skills */}
                        {data.skills && data.skills.length > 0 && (
                            <section className="mb-6">
                                <h2 className="text-[13px] font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                                    <span className="w-6 h-0.5 bg-gradient-to-r from-violet-600 to-indigo-600" />
                                    Skills
                                </h2>
                                {data.skills.map((cat) => (
                                    <div key={cat.id} className="mb-3">
                                        <h3 className="text-[10px] font-bold text-violet-600 uppercase tracking-wide mb-1.5">{cat.category}</h3>
                                        <div className="flex flex-wrap gap-1">
                                            {cat.skills.map((skill, i) => (
                                                <span key={i} className="text-[10px] px-2 py-1 bg-gray-100 text-gray-700 rounded-lg">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </section>
                        )}

                        {/* Education */}
                        {data.education && data.education.length > 0 && (
                            <section className="mb-6">
                                <h2 className="text-[13px] font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                                    <span className="w-6 h-0.5 bg-gradient-to-r from-violet-600 to-indigo-600" />
                                    Education
                                </h2>
                                {data.education.map((edu) => (
                                    <div key={edu.id} className="mb-3">
                                        <h3 className="text-[12px] font-bold text-gray-900">{edu.degree}</h3>
                                        <p className="text-[11px] text-gray-600">{edu.institution}</p>
                                        <p className="text-[10px] text-gray-400">{edu.graduationDate}</p>
                                    </div>
                                ))}
                            </section>
                        )}

                        {/* Certifications */}
                        {data.certificates && data.certificates.length > 0 && (
                            <section className="mb-6">
                                <h2 className="text-[13px] font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                                    <span className="w-6 h-0.5 bg-gradient-to-r from-violet-600 to-indigo-600" />
                                    Certifications
                                </h2>
                                {data.certificates.map((cert) => (
                                    <div key={cert.id} className="mb-2 p-2 bg-violet-50 rounded">
                                        <p className="text-[11px] font-semibold text-gray-800">{cert.name}</p>
                                        <p className="text-[10px] text-gray-500">{cert.issuer}</p>
                                    </div>
                                ))}
                            </section>
                        )}

                        {/* Languages */}
                        {data.languages && data.languages.length > 0 && (
                            <section>
                                <h2 className="text-[13px] font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                                    <span className="w-6 h-0.5 bg-gradient-to-r from-violet-600 to-indigo-600" />
                                    Languages
                                </h2>
                                {data.languages.map((lang) => (
                                    <div key={lang.id} className="flex justify-between text-[11px] mb-1.5">
                                        <span className="font-medium text-gray-700">{lang.language}</span>
                                        <span className="text-violet-600">{lang.proficiency}</span>
                                    </div>
                                ))}
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeTemplate11;
