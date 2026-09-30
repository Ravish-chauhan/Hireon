import { TemplateResumeData } from '@/types/resume';
import { hasSummaryText, getSummaryContent } from './index';
import { Mail, Phone, MapPin, Linkedin, Github, Globe, Twitter, Link } from 'lucide-react';

interface ResumeTemplate11Props {
    data: TemplateResumeData;
}

// Modern Gradient - Creative Tech Template
const ResumeTemplate11 = ({ data }: ResumeTemplate11Props) => {
    const align = data.settings?.headerAlignment || 'left';
    return (
        <div className="resume-page bg-white flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Header with gradient accent */}
            <div className="h-2 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600" />

            <div style={{ padding: 'var(--margin-y, 2rem) var(--margin-x, 2.5rem)' }}>
                {/* Header */}
                <header style={{
                    marginBottom: 'var(--spacing-section, 20px)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: align === 'center' ? 'center' : (align === 'right' ? 'flex-end' : 'flex-start'),
                    gap: 'var(--spacing-title-contact, 8px)',
                    width: '100%'
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: align === 'center' ? 'column' : 'row',
                        alignItems: 'center',
                        gap: '24px',
                        justifyContent: align === 'center' ? 'center' : (align === 'right' ? 'flex-end' : 'flex-start'),
                        width: '100%'
                    }}>
                        {data.personalInfo?.image && (
                            <img
                                src={data.personalInfo.image}
                                alt={data.personalInfo?.name || 'Profile'}
                                className="w-20 h-20 rounded-2xl object-cover shadow-lg"
                            />
                        )}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: align === 'center' ? 'center' : (align === 'right' ? 'flex-end' : 'flex-start'),
                            gap: 'var(--spacing-name-title, 6px)'
                        }}>
                            <h1 className="text-[length:var(--font-size-name)] font-[family-name:var(--font-family-name)] font-bold text-gray-900 leading-none" style={{ margin: 0, textAlign: align as any }}>
                                {data.personalInfo?.name || 'Your Name'}
                            </h1>
                            {data.personalInfo?.title && (
                                <p className="text-[length:var(--font-size-heading)] font-[family-name:var(--font-family-heading)] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600" style={{ margin: 0, textAlign: align as any }}>
                                    {data.personalInfo.title}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="flex flex-wrap gap-4 text-[length:calc(var(--font-size-body)*0.917)] font-[family-name:var(--font-family-body)] text-gray-600" style={{
                        justifyContent: align === 'center' ? 'center' : (align === 'right' ? 'flex-end' : 'flex-start'),
                        width: '100%'
                    }}>
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
                        {data.personalInfo?.contact?.socialLinks?.map((link) => {
                            const Icon = link.platform.toLowerCase() === 'linkedin' ? Linkedin :
                                link.platform.toLowerCase() === 'github' ? Github :
                                    link.platform.toLowerCase() === 'twitter' ? Twitter :
                                        link.platform.toLowerCase() === 'portfolio' ? Globe : Link;
                            return (
                                <span key={link.id} className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full">
                                    <Icon className="w-3.5 h-3.5 text-violet-600" />
                                    <a href={link.url.startsWith('http') ? link.url : 'https://' + link.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }} className="hover:underline">{data.personalInfo?.contact?.socialLinksFormat === 'url' ? link.url.replace(/^https?:\/\//, "") : link.platform}</a>
                                </span>
                            );
                        })}
                    </div>
                </header>

                {/* Summary */}
                {hasSummaryText(data.summary) && (
                    <section style={{ order: data.sectionOrder?.indexOf('summary') ?? 99, marginBottom: 'var(--spacing-section, 20px)' }} className="bg-gradient-to-r from-violet-50 to-indigo-50 p-4 rounded-xl border-l-4 border-violet-600">
                        <div className="text-[length:calc(var(--font-size-body)*1.000)] font-[family-name:var(--font-family-body)] leading-[1.7] text-gray-700" dangerouslySetInnerHTML={{ __html: getSummaryContent(data.summary) }} />
                    </section>
                )}

                {/* Two Column Layout */}
                <div className="flex gap-8">
                    {/* Main Content */}
                    <div className="flex-1" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-section, 20px)' }}>
                        {/* Experience */}
                        {data.experience && data.experience.length > 0 && (
                            <section style={{ order: data.sectionOrder?.indexOf('experience') ?? 99 }}>
                                <h2 className="text-[length:var(--font-size-heading)] font-[family-name:var(--font-family-heading)] [text-align:var(--align-heading)] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2" style={{ marginBottom: 'var(--spacing-section-heading, 10px)' }}>
                                    <span className="w-8 h-0.5 bg-gradient-to-r from-violet-600 to-indigo-600" />
                                    Experience
                                </h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-item, 14px)' }}>
                                    {data.experience.map((exp) => (
                                        <div key={exp.id} className="relative pl-4 border-l-2 border-gray-200">
                                            <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600" />
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-[length:calc(var(--font-size-body)*1.083)] font-[family-name:var(--font-family-body)] font-bold text-gray-900">{exp.title}</h3>
                                                    <p className="text-[length:calc(var(--font-size-body)*1.000)] font-[family-name:var(--font-family-body)] text-violet-600 font-semibold" style={{ marginTop: 'var(--spacing-role-company, 2px)' }}>{exp.company}</p>
                                                </div>
                                                <p className="text-[length:calc(var(--font-size-body)*0.833)] font-[family-name:var(--font-family-body)] text-gray-500 font-medium">{exp.startDate} – {exp.endDate}</p>
                                            </div>
                                            {exp.description && exp.description.length > 0 && (
                                                <ul className="flex flex-col" style={{ marginTop: 'var(--spacing-role-description, 6px)', gap: 'var(--spacing-list-items, 2px)' }}>
                                                    {exp.description.map((desc, i) => (
                                                        <li key={i} className="text-[length:calc(var(--font-size-body)*0.917)] font-[family-name:var(--font-family-body)] text-gray-600 leading-relaxed flex gap-2">
                                                            <span className="text-violet-400 mt-0.5">›</span> {desc}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Projects */}
                        {data.projects && data.projects.length > 0 && (
                            <section style={{ order: data.sectionOrder?.indexOf('projects') ?? 99 }}>
                                <h2 className="text-[length:var(--font-size-heading)] font-[family-name:var(--font-family-heading)] [text-align:var(--align-heading)] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2" style={{ marginBottom: 'var(--spacing-section-heading, 10px)' }}>
                                    <span className="w-8 h-0.5 bg-gradient-to-r from-violet-600 to-indigo-600" />
                                    Projects
                                </h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-item, 10px)' }}>
                                    {data.projects.map((proj) => (
                                        <div key={proj.id} className="p-3 bg-gray-50 rounded-lg">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-[length:calc(var(--font-size-body)*1.083)] font-[family-name:var(--font-family-body)] font-bold text-gray-900">{proj.name}</h3>
                                                {proj.link && <Globe className="w-3.5 h-3.5 text-violet-600" />}
                                            </div>
                                            <p className="text-[length:calc(var(--font-size-body)*0.917)] font-[family-name:var(--font-family-body)] text-gray-600" style={{ marginTop: 'var(--spacing-role-description, 4px)' }}>
                                                {Array.isArray(proj.description) ? proj.description[0] : proj.description}
                                            </p>
                                            {proj.technologies && (
                                                <div className="flex flex-wrap gap-1.5 mt-2">
                                                    {proj.technologies.map((tech, i) => (
                                                        <span key={i} className="text-[length:calc(var(--font-size-body)*0.750)] font-[family-name:var(--font-family-body)] px-2 py-0.5 bg-violet-100 text-violet-700 rounded font-medium">
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
                    <div className="w-[2.2in]" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-section, 20px)' }}>
                        {/* Skills */}
                        {data.skills && data.skills.length > 0 && (
                            <section style={{ order: data.sectionOrder?.indexOf('skills') ?? 99 }}>
                                <h2 className="text-[length:var(--font-size-heading)] font-[family-name:var(--font-family-heading)] [text-align:var(--align-heading)] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2" style={{ marginBottom: 'var(--spacing-section-heading, 10px)' }}>
                                    <span className="w-6 h-0.5 bg-gradient-to-r from-violet-600 to-indigo-600" />
                                    Skills
                                </h2>
                                <div style={{
                                    display: data.settings?.skillsLayout === 'two-column' ? 'grid' : 'flex',
                                    gridTemplateColumns: data.settings?.skillsLayout === 'two-column' ? '1fr 1fr' : undefined,
                                    columnGap: data.settings?.skillsLayout === 'two-column' ? '24px' : undefined,
                                    flexDirection: data.settings?.skillsLayout === 'inline-wrap' ? 'row' : 'column',
                                    flexWrap: data.settings?.skillsLayout === 'inline-wrap' ? 'wrap' : undefined,
                                    gap: data.settings?.skillsLayout === 'two-column' ? undefined : `${data.settings?.spacingSkillsRow ?? 8}px`,
                                    rowGap: data.settings?.skillsLayout === 'two-column' ? `${data.settings?.spacingSkillsRow ?? 8}px` : undefined,
                                }}>
                                    {data.skills.map((cat) => {
                                        const isBlock = data.settings?.skillsLayout === 'block';
                                        if (isBlock) {
                                          return (
                                            <div key={cat.id} style={{ 
                                                display: 'flex', 
                                                flexDirection: 'column', 
                                                gap: '4px', 
                                                alignItems: 'flex-start' 
                                            }}>
                                                <h3 className="text-[length:calc(var(--font-size-body)*0.833)] font-[family-name:var(--font-family-body)] font-bold text-violet-600 uppercase tracking-wide" style={{ marginBottom: 0, whiteSpace: 'nowrap' }}>{cat.category}:</h3>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: `${data.settings?.spacingSkillsItem ?? 4}px`, rowGap: '4px' }}>
                                                    {cat.skills.map((skill, i) => (
                                                        <span key={i} className="text-[length:calc(var(--font-size-body)*0.833)] font-[family-name:var(--font-family-body)] text-gray-700">
                                                            {skill}{i < cat.skills.length - 1 ? (data.settings?.skillsSeparator || ', ') : ''}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                          );
                                        } else {
                                          return (
                                            <div key={cat.id} style={{ 
                                                display: 'flex', 
                                                flexWrap: 'wrap', 
                                                alignItems: 'baseline',
                                                columnGap: `${data.settings?.spacingSkillsItem ?? 4}px`,
                                                rowGap: '4px'
                                            }}>
                                                <h3 className="text-[length:calc(var(--font-size-body)*0.833)] font-[family-name:var(--font-family-body)] font-bold text-violet-600 uppercase tracking-wide" style={{ marginBottom: 0, whiteSpace: 'nowrap', marginRight: '6px' }}>{cat.category}:</h3>
                                                {cat.skills.map((skill, i) => (
                                                    <span key={i} className="text-[length:calc(var(--font-size-body)*0.833)] font-[family-name:var(--font-family-body)] text-gray-700">
                                                        {skill}{i < cat.skills.length - 1 ? (data.settings?.skillsSeparator || ', ') : ''}
                                                    </span>
                                                ))}
                                            </div>
                                          );
                                        }
                                    })}
                                </div>
                            </section>
                        )}

                        {/* Education */}
                        {data.education && data.education.length > 0 && (
                            <section style={{ order: data.sectionOrder?.indexOf('education') ?? 99 }}>
                                <h2 className="text-[length:var(--font-size-heading)] font-[family-name:var(--font-family-heading)] [text-align:var(--align-heading)] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2" style={{ marginBottom: 'var(--spacing-section-heading, 10px)' }}>
                                    <span className="w-6 h-0.5 bg-gradient-to-r from-violet-600 to-indigo-600" />
                                    Education
                                </h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-item, 10px)' }}>
                                    {data.education.map((edu) => (
                                        <div key={edu.id}>
                                            <h3 className="text-[length:calc(var(--font-size-body)*1.000)] font-[family-name:var(--font-family-body)] font-bold text-gray-900">{edu.degree}</h3>
                                            <p className="text-[length:calc(var(--font-size-body)*0.917)] font-[family-name:var(--font-family-body)] text-gray-600" style={{ marginTop: 'var(--spacing-role-company, 2px)' }}>{edu.institution}</p>
                                            <p className="text-[length:calc(var(--font-size-body)*0.833)] font-[family-name:var(--font-family-body)] text-gray-400">{edu.graduationDate}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Certifications */}
                        {data.certificates && data.certificates.length > 0 && (
                            <section style={{ order: data.sectionOrder?.indexOf('certificates') ?? 99 }}>
                                <h2 className="text-[length:var(--font-size-heading)] font-[family-name:var(--font-family-heading)] [text-align:var(--align-heading)] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2" style={{ marginBottom: 'var(--spacing-section-heading, 10px)' }}>
                                    <span className="w-6 h-0.5 bg-gradient-to-r from-violet-600 to-indigo-600" />
                                    Certifications
                                </h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-item, 6px)' }}>
                                    {data.certificates.map((cert) => (
                                        <div key={cert.id} className="p-2 bg-violet-50 rounded">
                                            <p className="text-[length:calc(var(--font-size-body)*0.917)] font-[family-name:var(--font-family-body)] font-semibold text-gray-800">{cert.name}</p>
                                            <p className="text-[length:calc(var(--font-size-body)*0.833)] font-[family-name:var(--font-family-body)] text-gray-500">{cert.issuer}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Languages */}
                        {data.languages && data.languages.length > 0 && (
                            <section style={{ order: data.sectionOrder?.indexOf('languages') ?? 99 }}>
                                <h2 className="text-[length:var(--font-size-heading)] font-[family-name:var(--font-family-heading)] [text-align:var(--align-heading)] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2" style={{ marginBottom: 'var(--spacing-section-heading, 10px)' }}>
                                    <span className="w-6 h-0.5 bg-gradient-to-r from-violet-600 to-indigo-600" />
                                    Languages
                                </h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-list-items, 4px)' }}>
                                    {data.languages.map((lang) => (
                                        <div key={lang.id} className="flex justify-between text-[length:calc(var(--font-size-body)*0.917)] font-[family-name:var(--font-family-body)]">
                                            <span className="font-medium text-gray-700">{lang.language}</span>
                                            <span className="text-violet-600">{lang.proficiency}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeTemplate11;
