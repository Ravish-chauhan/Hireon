import { TemplateResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface ResumeTemplate14Props {
    data: TemplateResumeData;
}

// Coral Creative - Bold & Modern for Creative Professionals
const ResumeTemplate14 = ({ data }: ResumeTemplate14Props) => {
    return (
        <div className="resume-page bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div className="flex">
                {/* Left - Coral Sidebar */}
                <div className="w-[2.8in] bg-gradient-to-b from-rose-500 to-orange-500 text-white min-h-full" style={{ padding: 'var(--margin-y, 2rem) var(--margin-x, 2rem)' }}>
                    {/* Profile */}
                    <div className="text-center mb-8">
                        {data.personalInfo?.image && (
                            <img
                                src={data.personalInfo.image}
                                alt={data.personalInfo?.name || 'Profile'}
                                className="w-28 h-28 rounded-full object-cover mx-auto mb-4 border-4 border-white/30 shadow-lg"
                            />
                        )}
                        <h1 className="text-[24px] font-bold leading-tight">
                            {data.personalInfo?.name || 'Your Name'}
                        </h1>
                        <p className="text-[13px] text-rose-100 font-medium mt-1">
                            {data.personalInfo?.title || 'Professional Title'}
                        </p>
                    </div>

                    {/* Contact */}
                    <section className="mb-8">
                        <h2 className="text-[11px] font-bold uppercase tracking-wider text-rose-200 mb-3 border-b border-white/20 pb-2">
                            Contact
                        </h2>
                        <div className="space-y-2 text-[10px]">
                            {data.personalInfo?.contact?.email && (
                                <div className="flex items-center gap-2">
                                    <Mail className="w-3.5 h-3.5 text-rose-200" />
                                    <span>{data.personalInfo.contact.email}</span>
                                </div>
                            )}
                            {data.personalInfo?.contact?.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone className="w-3.5 h-3.5 text-rose-200" />
                                    <span>{data.personalInfo.contact.phone}</span>
                                </div>
                            )}
                            {data.personalInfo?.contact?.location && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-3.5 h-3.5 text-rose-200" />
                                    <span>{data.personalInfo.contact.location}</span>
                                </div>
                            )}
                            {data.personalInfo?.contact?.linkedin && (
                                <div className="flex items-center gap-2">
                                    <Linkedin className="w-3.5 h-3.5 text-rose-200" />
                                    <span>{data.personalInfo.contact.linkedin}</span>
                                </div>
                            )}
                            {data.personalInfo?.contact?.website && (
                                <div className="flex items-center gap-2">
                                    <Globe className="w-3.5 h-3.5 text-rose-200" />
                                    <span>{data.personalInfo.contact.website}</span>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Skills */}
                    {data.skills && data.skills.length > 0 && (
                        <section className="mb-8">
                            <h2 className="text-[11px] font-bold uppercase tracking-wider text-rose-200 mb-3 border-b border-white/20 pb-2">
                                Expertise
                            </h2>
                            {data.skills.map((cat) => (
                                <div key={cat.id} className="mb-3">
                                    <h3 className="text-[10px] text-rose-200 font-medium mb-1.5">{cat.category}</h3>
                                    <div className="flex flex-wrap gap-1.5">
                                        {cat.skills.map((skill, i) => (
                                            <span key={i} className="text-[9px] px-2 py-1 bg-white/20 rounded-full">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </section>
                    )}

                    {/* Languages */}
                    {data.languages && data.languages.length > 0 && (
                        <section className="mb-8">
                            <h2 className="text-[11px] font-bold uppercase tracking-wider text-rose-200 mb-3 border-b border-white/20 pb-2">
                                Languages
                            </h2>
                            {data.languages.map((lang) => (
                                <div key={lang.id} className="flex justify-between text-[10px] mb-1.5">
                                    <span>{lang.language}</span>
                                    <span className="text-rose-200">{lang.proficiency}</span>
                                </div>
                            ))}
                        </section>
                    )}

                    {/* Certifications */}
                    {data.certificates && data.certificates.length > 0 && (
                        <section>
                            <h2 className="text-[11px] font-bold uppercase tracking-wider text-rose-200 mb-3 border-b border-white/20 pb-2">
                                Certifications
                            </h2>
                            {data.certificates.map((cert) => (
                                <div key={cert.id} className="mb-2">
                                    <p className="text-[10px] font-medium">{cert.name}</p>
                                    <p className="text-[9px] text-rose-200">{cert.issuer} • {cert.date}</p>
                                </div>
                            ))}
                        </section>
                    )}
                </div>

                {/* Right - Main Content */}
                <div className="flex-1" style={{ padding: 'var(--margin-y, 2rem) var(--margin-x, 2.5rem)' }}>
                    {/* Summary */}
                    {data.summary && (
                        <section className="mb-6">
                            <h2 className="text-[14px] font-bold text-gray-900 mb-2 flex items-center gap-2">
                                <span className="w-8 h-1 bg-gradient-to-r from-rose-500 to-orange-500 rounded" />
                                About Me
                            </h2>
                            <div className="text-[11px] leading-[1.8] text-gray-600" dangerouslySetInnerHTML={{ __html: data.summary }} />
                        </section>
                    )}

                    {/* Experience */}
                    {data.experience && data.experience.length > 0 && (
                        <section className="mb-6">
                            <h2 className="text-[14px] font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-8 h-1 bg-gradient-to-r from-rose-500 to-orange-500 rounded" />
                                Work Experience
                            </h2>
                            {data.experience.map((exp) => (
                                <div key={exp.id} className="mb-5 relative pl-5 border-l-2 border-rose-200">
                                    <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-gradient-to-r from-rose-500 to-orange-500" />
                                    <div className="flex justify-between items-start mb-1">
                                        <div>
                                            <h3 className="text-[13px] font-bold text-gray-900">{exp.title}</h3>
                                            <p className="text-[11px] text-rose-500 font-semibold">{exp.company}</p>
                                        </div>
                                        <p className="text-[10px] text-gray-400">{exp.startDate} – {exp.endDate}</p>
                                    </div>
                                    {exp.description && exp.description.length > 0 && (
                                        <ul className="mt-2 space-y-1">
                                            {exp.description.map((desc, i) => (
                                                <li key={i} className="text-[10px] text-gray-600 leading-relaxed">• {desc}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </section>
                    )}

                    {/* Education */}
                    {data.education && data.education.length > 0 && (
                        <section className="mb-6">
                            <h2 className="text-[14px] font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <span className="w-8 h-1 bg-gradient-to-r from-rose-500 to-orange-500 rounded" />
                                Education
                            </h2>
                            {data.education.map((edu) => (
                                <div key={edu.id} className="mb-3 flex justify-between items-start">
                                    <div>
                                        <h3 className="text-[12px] font-bold text-gray-900">{edu.degree}</h3>
                                        <p className="text-[11px] text-gray-600">{edu.institution}</p>
                                    </div>
                                    <p className="text-[10px] text-gray-400">{edu.graduationDate}</p>
                                </div>
                            ))}
                        </section>
                    )}

                    {/* Projects */}
                    {data.projects && data.projects.length > 0 && (
                        <section>
                            <h2 className="text-[14px] font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <span className="w-8 h-1 bg-gradient-to-r from-rose-500 to-orange-500 rounded" />
                                Projects
                            </h2>
                            <div className="grid grid-cols-2 gap-3">
                                {data.projects.map((proj) => (
                                    <div key={proj.id} className="bg-rose-50 p-3 rounded-lg">
                                        <h3 className="text-[11px] font-bold text-gray-900">{proj.name}</h3>
                                        <p className="text-[9px] text-gray-600 mt-1">
                                            {Array.isArray(proj.description) ? proj.description[0] : proj.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResumeTemplate14;
