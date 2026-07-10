import { TemplateResumeData } from '@/types/resume';
import { Mail, Phone, Linkedin, Github, Globe, Award, Briefcase, GraduationCap, Code } from 'lucide-react';

interface ResumeTemplate13Props {
    data: TemplateResumeData;
}

// Tech Modern - Developer/Tech Professional Template
const ResumeTemplate13 = ({ data }: ResumeTemplate13Props) => {
    return (
        <div className="resume-page bg-[#0f172a]" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
            {/* Header */}
            <header className="bg-gradient-to-r from-emerald-600 to-teal-600" style={{ padding: 'var(--margin-y, 2rem) var(--margin-x, 2.5rem)' }}>
                <div className="flex items-center gap-6">
                    {data.personalInfo?.image && (
                        <img
                            src={data.personalInfo.image}
                            alt={data.personalInfo?.name || 'Profile'}
                            className="w-20 h-20 rounded-xl object-cover border-4 border-white/20"
                        />
                    )}
                    <div className="text-white">
                        <h1 className="text-[28px] font-bold leading-none mb-1">
                            {data.personalInfo?.name || 'Your Name'}
                        </h1>
                        <p className="text-emerald-100 text-[14px] font-medium">
                            <span className="text-emerald-300">{'<'}</span>
                            {data.personalInfo?.title || 'Professional Title'}
                            <span className="text-emerald-300">{' />'}</span>
                        </p>
                    </div>
                </div>

                {/* Contact */}
                <div className="mt-4 flex flex-wrap gap-4 text-[10px] text-white/80 font-mono">
                    {data.personalInfo?.contact?.email && (
                        <span className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5" /> {data.personalInfo.contact.email}
                        </span>
                    )}
                    {data.personalInfo?.contact?.phone && (
                        <span className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5" /> {data.personalInfo.contact.phone}
                        </span>
                    )}
                    {data.personalInfo?.contact?.github && (
                        <span className="flex items-center gap-1.5">
                            <Github className="w-3.5 h-3.5" /> {data.personalInfo.contact.github}
                        </span>
                    )}
                    {data.personalInfo?.contact?.linkedin && (
                        <span className="flex items-center gap-1.5">
                            <Linkedin className="w-3.5 h-3.5" /> {data.personalInfo.contact.linkedin}
                        </span>
                    )}
                    {data.personalInfo?.contact?.website && (
                        <span className="flex items-center gap-1.5">
                            <Globe className="w-3.5 h-3.5" /> {data.personalInfo.contact.website}
                        </span>
                    )}
                </div>
            </header>

            {/* Content */}
            <div className="flex" style={{ fontFamily: "'Inter', sans-serif" }}>
                {/* Main */}
                <div className="flex-1 bg-white" style={{ padding: 'var(--margin-y, 2rem) var(--margin-x, 2.5rem)' }}>
                    {/* Summary */}
                    {data.summary && (
                        <section className="mb-6">
                            <h2 className="text-[12px] font-bold uppercase tracking-wider text-emerald-600 mb-2 flex items-center gap-2">
                                <span className="text-emerald-400">{'//'}</span> About
                            </h2>
                            <div className="text-[11px] leading-[1.7] text-gray-600" dangerouslySetInnerHTML={{ __html: data.summary }} />
                        </section>
                    )}

                    {/* Experience */}
                    {data.experience && data.experience.length > 0 && (
                        <section className="mb-6">
                            <h2 className="text-[12px] font-bold uppercase tracking-wider text-emerald-600 mb-3 flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-emerald-400" /> Experience
                            </h2>
                            {data.experience.map((exp) => (
                                <div key={exp.id} className="mb-4 pl-4 border-l-2 border-emerald-200">
                                    <div className="flex justify-between items-start mb-1">
                                        <div>
                                            <h3 className="text-[13px] font-bold text-gray-900">{exp.title}</h3>
                                            <p className="text-[11px] text-emerald-600 font-semibold">{exp.company}</p>
                                        </div>
                                        <span className="text-[9px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded font-mono">
                                            {exp.startDate} → {exp.endDate}
                                        </span>
                                    </div>
                                    {exp.description && exp.description.length > 0 && (
                                        <ul className="mt-2 space-y-1">
                                            {exp.description.map((desc, i) => (
                                                <li key={i} className="text-[10px] text-gray-600 leading-relaxed flex gap-2">
                                                    <span className="text-emerald-400 font-mono">→</span> {desc}
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
                        <section>
                            <h2 className="text-[12px] font-bold uppercase tracking-wider text-emerald-600 mb-3 flex items-center gap-2">
                                <Code className="w-4 h-4 text-emerald-400" /> Projects
                            </h2>
                            <div className="grid grid-cols-2 gap-3">
                                {data.projects.map((proj) => (
                                    <div key={proj.id} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <h3 className="text-[12px] font-bold text-gray-900 mb-1">{proj.name}</h3>
                                        <p className="text-[10px] text-gray-600 mb-2">
                                            {Array.isArray(proj.description) ? proj.description[0] : proj.description}
                                        </p>
                                        {proj.technologies && (
                                            <div className="flex flex-wrap gap-1">
                                                {proj.technologies.slice(0, 4).map((tech, i) => (
                                                    <span key={i} className="text-[8px] px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded font-mono">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Sidebar */}
                <div className="w-[2.4in] bg-slate-800 text-white" style={{ padding: 'var(--margin-y, 1.5rem) var(--margin-x, 1.5rem)' }}>
                    {/* Skills */}
                    {data.skills && data.skills.length > 0 && (
                        <section className="mb-6">
                            <h2 className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-3">
                                {'<'} Tech Stack {' />'}
                            </h2>
                            {data.skills.map((cat) => (
                                <div key={cat.id} className="mb-3">
                                    <h3 className="text-[9px] text-slate-400 uppercase tracking-wide mb-1.5">{cat.category}</h3>
                                    <div className="flex flex-wrap gap-1">
                                        {cat.skills.map((skill, i) => (
                                            <span key={i} className="text-[9px] px-2 py-0.5 bg-slate-700 text-slate-300 rounded font-mono">
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
                            <h2 className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-3">
                                <GraduationCap className="w-4 h-4 inline-block mr-1" /> Education
                            </h2>
                            {data.education.map((edu) => (
                                <div key={edu.id} className="mb-3">
                                    <h3 className="text-[11px] font-bold text-white">{edu.degree}</h3>
                                    <p className="text-[10px] text-slate-400">{edu.institution}</p>
                                    <p className="text-[9px] text-slate-500">{edu.graduationDate}</p>
                                </div>
                            ))}
                        </section>
                    )}

                    {/* Certifications */}
                    {data.certificates && data.certificates.length > 0 && (
                        <section>
                            <h2 className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-3">
                                <Award className="w-4 h-4 inline-block mr-1" /> Certifications
                            </h2>
                            {data.certificates.map((cert) => (
                                <div key={cert.id} className="mb-2 p-2 bg-slate-700/50 rounded">
                                    <p className="text-[10px] font-semibold text-white">{cert.name}</p>
                                    <p className="text-[9px] text-slate-400">{cert.issuer}</p>
                                </div>
                            ))}
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResumeTemplate13;
