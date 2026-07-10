import { TemplateResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Linkedin } from 'lucide-react';

interface ResumeTemplate15Props {
    data: TemplateResumeData;
}

// Corporate Elite - Traditional Corporate Template
const ResumeTemplate15 = ({ data }: ResumeTemplate15Props) => {
    return (
        <div className="resume-page bg-white" style={{ fontFamily: "'Times New Roman', serif", padding: 'var(--margin-y, 2.5rem) var(--margin-x, 2.5rem)' }}>
            {/* Header */}
            <header className="border-b-4 border-double border-gray-900 pb-4 mb-6">
                <h1 className="text-[28px] font-bold text-center text-gray-900 tracking-wide mb-1">
                    {data.personalInfo?.name?.toUpperCase() || 'YOUR NAME'}
                </h1>
                <p className="text-[14px] text-center text-gray-600 mb-3">
                    {data.personalInfo?.title || 'Professional Title'}
                </p>

                {/* Contact - Centered Single Line */}
                <div className="flex justify-center items-center gap-4 text-[11px] text-gray-600 flex-wrap">
                    {data.personalInfo?.contact?.email && (
                        <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5" /> {data.personalInfo.contact.email}
                        </span>
                    )}
                    {data.personalInfo?.contact?.phone && (
                        <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5" /> {data.personalInfo.contact.phone}
                        </span>
                    )}
                    {data.personalInfo?.contact?.location && (
                        <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" /> {data.personalInfo.contact.location}
                        </span>
                    )}
                    {data.personalInfo?.contact?.linkedin && (
                        <span className="flex items-center gap-1">
                            <Linkedin className="w-3.5 h-3.5" /> {data.personalInfo.contact.linkedin}
                        </span>
                    )}
                </div>
            </header>

            {/* Summary */}
            {data.summary && (
                <section className="mb-6">
                    <h2 className="text-[13px] font-bold uppercase tracking-widest text-gray-900 mb-2 border-b border-gray-300 pb-1">
                        Professional Summary
                    </h2>
                    <div className="text-[11px] leading-[1.8] text-gray-700 text-justify" dangerouslySetInnerHTML={{ __html: data.summary }} />
                </section>
            )}

            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-[13px] font-bold uppercase tracking-widest text-gray-900 mb-3 border-b border-gray-300 pb-1">
                        Professional Experience
                    </h2>
                    {data.experience.map((exp) => (
                        <div key={exp.id} className="mb-4">
                            <div className="flex justify-between items-baseline mb-1">
                                <div>
                                    <h3 className="text-[13px] font-bold text-gray-900">{exp.title}</h3>
                                    <p className="text-[12px] text-gray-700">{exp.company}{exp.location && `, ${exp.location}`}</p>
                                </div>
                                <p className="text-[11px] text-gray-600 italic">{exp.startDate} – {exp.endDate}</p>
                            </div>
                            {exp.description && exp.description.length > 0 && (
                                <ul className="mt-2 space-y-0.5">
                                    {exp.description.map((desc, i) => (
                                        <li key={i} className="text-[10px] text-gray-700 leading-relaxed pl-4 relative before:content-['▪'] before:absolute before:left-0 before:text-gray-500">
                                            {desc}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </section>
            )}

            {/* Two Column */}
            <div className="flex gap-8">
                {/* Education */}
                <div className="flex-1">
                    {data.education && data.education.length > 0 && (
                        <section className="mb-6">
                            <h2 className="text-[13px] font-bold uppercase tracking-widest text-gray-900 mb-2 border-b border-gray-300 pb-1">
                                Education
                            </h2>
                            {data.education.map((edu) => (
                                <div key={edu.id} className="mb-3">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="text-[12px] font-bold text-gray-900">{edu.degree}</h3>
                                        <p className="text-[10px] text-gray-600 italic">{edu.graduationDate}</p>
                                    </div>
                                    <p className="text-[11px] text-gray-600">{edu.institution}</p>
                                    {edu.gpa && <p className="text-[10px] text-gray-500">GPA: {edu.gpa}</p>}
                                </div>
                            ))}
                        </section>
                    )}

                    {/* Certifications */}
                    {data.certificates && data.certificates.length > 0 && (
                        <section>
                            <h2 className="text-[13px] font-bold uppercase tracking-widest text-gray-900 mb-2 border-b border-gray-300 pb-1">
                                Certifications
                            </h2>
                            {data.certificates.map((cert) => (
                                <div key={cert.id} className="mb-2">
                                    <p className="text-[11px] font-semibold text-gray-800">{cert.name}</p>
                                    <p className="text-[10px] text-gray-600">{cert.issuer}, {cert.date}</p>
                                </div>
                            ))}
                        </section>
                    )}
                </div>

                {/* Skills */}
                <div className="w-[2.5in]">
                    {data.skills && data.skills.length > 0 && (
                        <section className="mb-6">
                            <h2 className="text-[13px] font-bold uppercase tracking-widest text-gray-900 mb-2 border-b border-gray-300 pb-1">
                                Core Competencies
                            </h2>
                            {data.skills.map((cat) => (
                                <div key={cat.id} className="mb-3">
                                    <h3 className="text-[10px] font-bold text-gray-700 uppercase mb-1">{cat.category}</h3>
                                    <p className="text-[10px] text-gray-600">{cat.skills.join(' • ')}</p>
                                </div>
                            ))}
                        </section>
                    )}

                    {/* Languages */}
                    {data.languages && data.languages.length > 0 && (
                        <section>
                            <h2 className="text-[13px] font-bold uppercase tracking-widest text-gray-900 mb-2 border-b border-gray-300 pb-1">
                                Languages
                            </h2>
                            {data.languages.map((lang) => (
                                <div key={lang.id} className="flex justify-between text-[10px] mb-1">
                                    <span className="text-gray-700">{lang.language}</span>
                                    <span className="text-gray-500">{lang.proficiency}</span>
                                </div>
                            ))}
                        </section>
                    )}
                </div>
            </div>

            {/* Awards */}
            {data.awards && data.awards.length > 0 && (
                <section className="mt-4">
                    <h2 className="text-[13px] font-bold uppercase tracking-widest text-gray-900 mb-2 border-b border-gray-300 pb-1">
                        Awards & Honors
                    </h2>
                    <div className="grid grid-cols-2 gap-2">
                        {data.awards.map((award) => (
                            <div key={award.id}>
                                <p className="text-[11px] font-semibold text-gray-800">{award.title}</p>
                                <p className="text-[10px] text-gray-600">{award.date}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default ResumeTemplate15;
