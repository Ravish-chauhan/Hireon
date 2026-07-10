import { TemplateResumeData } from '@/types/resume';

interface ResumeTemplate12Props {
    data: TemplateResumeData;
}

// Clean Minimal - Simple & Elegant ATS-Perfect Template
const ResumeTemplate12 = ({ data }: ResumeTemplate12Props) => {
    return (
        <div className="resume-page bg-white" style={{ fontFamily: "'Georgia', serif", padding: 'var(--margin-y, 2.5rem) var(--margin-x, 3rem)' }}>
            {/* Header - Clean Centered */}
            <header className="text-center mb-8 pb-6 border-b border-gray-200">
                <h1 className="text-[32px] font-normal tracking-wide text-gray-900 mb-1" style={{ fontFamily: "'Georgia', serif" }}>
                    {data.personalInfo?.name || 'Your Name'}
                </h1>
                <p className="text-[14px] text-gray-600 tracking-widest uppercase mb-4">
                    {data.personalInfo?.title || 'Professional Title'}
                </p>

                {/* Contact - Single Line */}
                <div className="flex justify-center items-center gap-4 text-[11px] text-gray-500 flex-wrap">
                    {data.personalInfo?.contact?.email && (
                        <span>{data.personalInfo.contact.email}</span>
                    )}
                    {data.personalInfo?.contact?.phone && (
                        <>
                            <span className="text-gray-300">|</span>
                            <span>{data.personalInfo.contact.phone}</span>
                        </>
                    )}
                    {data.personalInfo?.contact?.location && (
                        <>
                            <span className="text-gray-300">|</span>
                            <span>{data.personalInfo.contact.location}</span>
                        </>
                    )}
                    {data.personalInfo?.contact?.linkedin && (
                        <>
                            <span className="text-gray-300">|</span>
                            <span>{data.personalInfo.contact.linkedin}</span>
                        </>
                    )}
                </div>
            </header>

            {/* Summary */}
            {data.summary && (
                <section className="mb-6">
                    <h2 className="text-[11px] font-bold uppercase tracking-[3px] text-gray-400 mb-3 text-center">Summary</h2>
                    <div className="text-[12px] leading-[1.8] text-gray-700 text-center max-w-[6in] mx-auto" dangerouslySetInnerHTML={{ __html: data.summary }} />
                </section>
            )}

            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-[11px] font-bold uppercase tracking-[3px] text-gray-400 mb-4 text-center">Experience</h2>
                    {data.experience.map((exp) => (
                        <div key={exp.id} className="mb-5">
                            <div className="flex justify-between items-baseline mb-1">
                                <h3 className="text-[14px] font-semibold text-gray-900">{exp.title}</h3>
                                <p className="text-[11px] text-gray-500 italic">{exp.startDate} – {exp.endDate}</p>
                            </div>
                            <p className="text-[12px] text-gray-600 mb-2">{exp.company}{exp.location && `, ${exp.location}`}</p>
                            {exp.description && exp.description.length > 0 && (
                                <ul className="space-y-1">
                                    {exp.description.map((desc, i) => (
                                        <li key={i} className="text-[11px] text-gray-600 leading-relaxed pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400">
                                            {desc}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </section>
            )}

            {/* Two Columns */}
            <div className="flex gap-12">
                {/* Education */}
                <div className="flex-1">
                    {data.education && data.education.length > 0 && (
                        <section className="mb-6">
                            <h2 className="text-[11px] font-bold uppercase tracking-[3px] text-gray-400 mb-3 text-center">Education</h2>
                            {data.education.map((edu) => (
                                <div key={edu.id} className="mb-3 text-center">
                                    <h3 className="text-[13px] font-semibold text-gray-900">{edu.degree}</h3>
                                    <p className="text-[12px] text-gray-600">{edu.institution}</p>
                                    <p className="text-[11px] text-gray-500">{edu.graduationDate}</p>
                                </div>
                            ))}
                        </section>
                    )}
                </div>

                {/* Skills */}
                <div className="flex-1">
                    {data.skills && data.skills.length > 0 && (
                        <section className="mb-6">
                            <h2 className="text-[11px] font-bold uppercase tracking-[3px] text-gray-400 mb-3 text-center">Expertise</h2>
                            {data.skills.map((cat) => (
                                <div key={cat.id} className="mb-2 text-center">
                                    <p className="text-[11px] text-gray-600">{cat.skills.join(' • ')}</p>
                                </div>
                            ))}
                        </section>
                    )}
                </div>
            </div>

            {/* Certifications */}
            {data.certificates && data.certificates.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-[11px] font-bold uppercase tracking-[3px] text-gray-400 mb-3 text-center">Certifications</h2>
                    <div className="flex justify-center flex-wrap gap-4">
                        {data.certificates.map((cert) => (
                            <span key={cert.id} className="text-[11px] text-gray-600">
                                {cert.name} <span className="text-gray-400">({cert.issuer}, {cert.date})</span>
                            </span>
                        ))}
                    </div>
                </section>
            )}

            {/* Projects */}
            {data.projects && data.projects.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-[11px] font-bold uppercase tracking-[3px] text-gray-400 mb-4 text-center">Projects</h2>
                    {data.projects.map((proj) => (
                        <div key={proj.id} className="mb-3">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-[13px] font-semibold text-gray-900">{proj.name}</h3>
                                {proj.date && <span className="text-[10px] text-gray-500 italic">{proj.date}</span>}
                            </div>
                            <p className="text-[11px] text-gray-600 mt-1">
                                {Array.isArray(proj.description) ? proj.description[0] : proj.description}
                            </p>
                        </div>
                    ))}
                </section>
            )}
        </div>
    );
};

export default ResumeTemplate12;
