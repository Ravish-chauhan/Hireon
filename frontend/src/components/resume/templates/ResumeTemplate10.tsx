import { TemplateResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface ResumeTemplate10Props {
    data: TemplateResumeData;
}

// Executive Blue - Premium ATS-Optimized Template
const ResumeTemplate10 = ({ data }: ResumeTemplate10Props) => {
    return (
        <div className="resume-page bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Header */}
            <header className="bg-[#1e3a5f] text-white" style={{ padding: 'var(--margin-y, 2rem) var(--margin-x, 2.5rem)' }}>
                <div className="flex items-center gap-6">
                    {data.personalInfo?.image && (
                        <img
                            src={data.personalInfo.image}
                            alt={data.personalInfo?.name || 'Profile'}
                            className="w-24 h-24 rounded-full object-cover border-4 border-white/30"
                        />
                    )}
                    <div className="flex-1">
                        <h1 className="text-[36px] font-bold tracking-tight leading-none mb-2">
                            {data.personalInfo?.name || 'Your Name'}
                        </h1>
                        <p className="text-[18px] text-blue-200 font-medium tracking-wide">
                            {data.personalInfo?.title || 'Professional Title'}
                        </p>
                    </div>
                </div>

                {/* Contact Bar */}
                <div className="mt-6 flex flex-wrap gap-6 text-[12px]">
                    {data.personalInfo?.contact?.email && (
                        <span className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-blue-300" /> {data.personalInfo.contact.email}
                        </span>
                    )}
                    {data.personalInfo?.contact?.phone && (
                        <span className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-blue-300" /> {data.personalInfo.contact.phone}
                        </span>
                    )}
                    {data.personalInfo?.contact?.location && (
                        <span className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-blue-300" /> {data.personalInfo.contact.location}
                        </span>
                    )}
                    {data.personalInfo?.contact?.linkedin && (
                        <span className="flex items-center gap-2">
                            <Linkedin className="w-4 h-4 text-blue-300" /> {data.personalInfo.contact.linkedin}
                        </span>
                    )}
                    {data.personalInfo?.contact?.website && (
                        <span className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-blue-300" /> {data.personalInfo.contact.website}
                        </span>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <div style={{ padding: 'var(--margin-y, 2rem) var(--margin-x, 2.5rem)' }}>
                {/* Summary */}
                {data.summary && (
                    <section className="mb-6">
                        <h2 className="text-[14px] font-bold uppercase tracking-widest text-[#1e3a5f] mb-3 pb-2 border-b-2 border-[#1e3a5f]">
                            Professional Summary
                        </h2>
                        <div className="text-[12px] leading-[1.7] text-gray-700" dangerouslySetInnerHTML={{ __html: data.summary }} />
                    </section>
                )}

                {/* Experience */}
                {data.experience && data.experience.length > 0 && (
                    <section className="mb-6">
                        <h2 className="text-[14px] font-bold uppercase tracking-widest text-[#1e3a5f] mb-3 pb-2 border-b-2 border-[#1e3a5f]">
                            Professional Experience
                        </h2>
                        {data.experience.map((exp) => (
                            <div key={exp.id} className="mb-5">
                                <div className="flex justify-between items-start mb-1">
                                    <div>
                                        <h3 className="text-[14px] font-bold text-gray-900">{exp.title}</h3>
                                        <p className="text-[12px] text-[#1e3a5f] font-semibold">{exp.company}{exp.location && `, ${exp.location}`}</p>
                                    </div>
                                    <p className="text-[11px] text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded">{exp.startDate} – {exp.endDate}</p>
                                </div>
                                {exp.description && exp.description.length > 0 && (
                                    <ul className="mt-2 space-y-1">
                                        {exp.description.map((desc, i) => (
                                            <li key={i} className="text-[11px] text-gray-700 leading-relaxed pl-4 relative before:content-['▸'] before:absolute before:left-0 before:text-[#1e3a5f]">
                                                {desc}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </section>
                )}

                {/* Two Column Section */}
                <div className="flex gap-8">
                    {/* Left Column */}
                    <div className="flex-1">
                        {/* Education */}
                        {data.education && data.education.length > 0 && (
                            <section className="mb-6">
                                <h2 className="text-[14px] font-bold uppercase tracking-widest text-[#1e3a5f] mb-3 pb-2 border-b-2 border-[#1e3a5f]">
                                    Education
                                </h2>
                                {data.education.map((edu) => (
                                    <div key={edu.id} className="mb-3">
                                        <h3 className="text-[13px] font-bold text-gray-900">{edu.degree}</h3>
                                        <p className="text-[12px] text-gray-600">{edu.institution}</p>
                                        <p className="text-[11px] text-gray-500">{edu.graduationDate}{edu.gpa && ` • GPA: ${edu.gpa}`}</p>
                                    </div>
                                ))}
                            </section>
                        )}

                        {/* Certifications */}
                        {data.certificates && data.certificates.length > 0 && (
                            <section className="mb-6">
                                <h2 className="text-[14px] font-bold uppercase tracking-widest text-[#1e3a5f] mb-3 pb-2 border-b-2 border-[#1e3a5f]">
                                    Certifications
                                </h2>
                                {data.certificates.map((cert) => (
                                    <div key={cert.id} className="mb-2">
                                        <p className="text-[12px] font-semibold text-gray-800">{cert.name}</p>
                                        <p className="text-[11px] text-gray-500">{cert.issuer} • {cert.date}</p>
                                    </div>
                                ))}
                            </section>
                        )}
                    </div>

                    {/* Right Column */}
                    <div className="w-[2.5in]">
                        {/* Skills */}
                        {data.skills && data.skills.length > 0 && (
                            <section className="mb-6">
                                <h2 className="text-[14px] font-bold uppercase tracking-widest text-[#1e3a5f] mb-3 pb-2 border-b-2 border-[#1e3a5f]">
                                    Skills
                                </h2>
                                {data.skills.map((cat) => (
                                    <div key={cat.id} className="mb-3">
                                        <h3 className="text-[11px] font-bold text-gray-600 uppercase tracking-wide mb-1">{cat.category}</h3>
                                        <div className="flex flex-wrap gap-1.5">
                                            {cat.skills.map((skill, i) => (
                                                <span key={i} className="text-[10px] px-2 py-0.5 bg-[#1e3a5f]/10 text-[#1e3a5f] rounded font-medium">
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
                            <section>
                                <h2 className="text-[14px] font-bold uppercase tracking-widest text-[#1e3a5f] mb-3 pb-2 border-b-2 border-[#1e3a5f]">
                                    Languages
                                </h2>
                                {data.languages.map((lang) => (
                                    <div key={lang.id} className="flex justify-between text-[11px] mb-1">
                                        <span className="font-medium text-gray-700">{lang.language}</span>
                                        <span className="text-gray-500">{lang.proficiency}</span>
                                    </div>
                                ))}
                            </section>
                        )}
                    </div>
                </div>

                {/* Projects */}
                {data.projects && data.projects.length > 0 && (
                    <section className="mt-4">
                        <h2 className="text-[14px] font-bold uppercase tracking-widest text-[#1e3a5f] mb-3 pb-2 border-b-2 border-[#1e3a5f]">
                            Key Projects
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            {data.projects.map((proj) => (
                                <div key={proj.id} className="bg-gray-50 p-3 rounded-lg">
                                    <h3 className="text-[12px] font-bold text-gray-900">{proj.name}</h3>
                                    <p className="text-[10px] text-gray-600 mt-1">
                                        {Array.isArray(proj.description) ? proj.description[0] : proj.description}
                                    </p>
                                    {proj.technologies && (
                                        <p className="text-[9px] text-[#1e3a5f] mt-2 font-medium">{proj.technologies.join(' • ')}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default ResumeTemplate10;
