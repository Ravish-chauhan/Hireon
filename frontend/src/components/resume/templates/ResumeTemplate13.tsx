import { TemplateResumeData } from '@/types/resume';
import { Mail, Phone, Linkedin, Github, Globe, Award, Briefcase, GraduationCap, Code, Twitter, Link } from 'lucide-react';

interface ResumeTemplate13Props {
    data: TemplateResumeData;
}

// Tech Modern - Developer/Tech Professional Template
const ResumeTemplate13 = ({ data }: ResumeTemplate13Props) => {
    const align = data.settings?.headerAlignment || 'left';
    return (
        <div className="resume-page bg-[#0f172a] flex flex-col" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
            {/* Header */}
            <header className="bg-gradient-to-r from-emerald-600 to-teal-600" style={{
                padding: 'var(--margin-y, 2rem) var(--margin-x, 2.5rem)',
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
                            className="w-20 h-20 rounded-xl object-cover border-4 border-white/20"
                        />
                    )}
                    <div className="text-white" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: align === 'center' ? 'center' : (align === 'right' ? 'flex-end' : 'flex-start'),
                        gap: 'var(--spacing-name-title, 6px)'
                    }}>
                        <h1 className="text-[length:var(--font-size-name)] font-[family-name:var(--font-family-name)] font-bold leading-none" style={{ margin: 0, textAlign: align as any }}>
                            {data.personalInfo?.name || 'Your Name'}
                        </h1>
                        {data.personalInfo?.title && (
                            <p className="text-emerald-100 text-[length:calc(var(--font-size-body)*1.167)] font-[family-name:var(--font-family-body)] font-medium" style={{ margin: 0, textAlign: align as any }}>
                                <span className="text-emerald-300">{'<'}</span>
                                {data.personalInfo.title}
                                <span className="text-emerald-300">{' />'}</span>
                            </p>
                        )}
                    </div>
                </div>

                {/* Contact */}
                <div className="flex flex-wrap gap-4 text-[length:calc(var(--font-size-body)*0.833)] font-[family-name:var(--font-family-body)] text-white/80 font-mono" style={{
                    justifyContent: align === 'center' ? 'center' : (align === 'right' ? 'flex-end' : 'flex-start'),
                    width: '100%'
                }}>
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
                    {data.personalInfo?.contact?.socialLinks?.map((link) => {
                        const Icon = link.platform.toLowerCase() === 'linkedin' ? Linkedin :
                            link.platform.toLowerCase() === 'github' ? Github :
                                link.platform.toLowerCase() === 'twitter' ? Twitter :
                                    link.platform.toLowerCase() === 'portfolio' ? Globe : Link;
                        return (
                            <span key={link.id} className="flex items-center gap-1.5">
                                <Icon className="w-3.5 h-3.5" />
                                <a href={link.url.startsWith('http') ? link.url : 'https://' + link.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }} className="hover:underline">{data.personalInfo?.contact?.socialLinksFormat === 'url' ? link.url.replace(/^https?:\/\//, "") : link.platform}</a>
                            </span>
                        );
                    })}
                </div>
            </header>

            {/* Content */}
            <div className="flex" style={{ fontFamily: "'Inter', sans-serif" }}>
                {/* Main */}
                <div className="flex-1 bg-white" style={{ padding: 'var(--margin-y, 2rem) var(--margin-x, 2.5rem)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-section, 16px)' }}>
                    {/* Summary */}
                    {data.summary && (
                        <section style={{ order: data.sectionOrder?.indexOf('summary') ?? 99 }}>
                            <h2 className="text-[length:var(--font-size-heading)] font-[family-name:var(--font-family-heading)] [text-align:var(--align-heading)] font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-2" style={{ marginBottom: 'var(--spacing-section-heading, 8px)' }}>
                                <span className="text-emerald-400">{'//'}</span> About
                            </h2>
                            <div className="text-[length:calc(var(--font-size-body)*0.917)] font-[family-name:var(--font-family-body)] leading-[1.7] text-gray-600" dangerouslySetInnerHTML={{ __html: data.summary }} />
                        </section>
                    )}

                    {/* Experience */}
                    {data.experience && data.experience.length > 0 && (
                        <section style={{ order: data.sectionOrder?.indexOf('experience') ?? 99 }}>
                            <h2 className="text-[length:var(--font-size-heading)] font-[family-name:var(--font-family-heading)] [text-align:var(--align-heading)] font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-2" style={{ marginBottom: 'var(--spacing-section-heading, 8px)' }}>
                                <Briefcase className="w-4 h-4 text-emerald-400" /> Experience
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-item, 14px)' }}>
                                {data.experience.map((exp) => (
                                    <div key={exp.id} className="pl-4 border-l-2 border-emerald-200">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-[length:var(--font-size-heading)] font-[family-name:var(--font-family-heading)] font-bold text-gray-900">{exp.title}</h3>
                                                <p className="text-[length:calc(var(--font-size-body)*0.917)] font-[family-name:var(--font-family-body)] text-emerald-600 font-semibold" style={{ marginTop: 'var(--spacing-role-company, 2px)' }}>{exp.company}</p>
                                            </div>
                                            <span className="text-[length:calc(var(--font-size-body)*0.750)] font-[family-name:var(--font-family-body)] text-gray-500 bg-gray-100 px-2 py-0.5 rounded font-mono">
                                                {exp.startDate} → {exp.endDate}
                                            </span>
                                        </div>
                                        {exp.description && exp.description.length > 0 && (
                                            <ul className="flex flex-col" style={{ marginTop: 'var(--spacing-role-description, 6px)', gap: 'var(--spacing-list-items, 2px)' }}>
                                                {exp.description.map((desc, i) => (
                                                    <li key={i} className="text-[length:calc(var(--font-size-body)*0.833)] font-[family-name:var(--font-family-body)] text-gray-600 leading-relaxed flex gap-2">
                                                        <span className="text-emerald-400 font-mono">→</span> {desc}
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
                            <h2 className="text-[length:var(--font-size-heading)] font-[family-name:var(--font-family-heading)] [text-align:var(--align-heading)] font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-2" style={{ marginBottom: 'var(--spacing-section-heading, 8px)' }}>
                                <Code className="w-4 h-4 text-emerald-400" /> Projects
                            </h2>
                            <div className="grid grid-cols-2" style={{ gap: 'var(--spacing-item, 12px)' }}>
                                {data.projects.map((proj) => (
                                    <div key={proj.id} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <h3 className="text-[length:var(--font-size-heading)] font-[family-name:var(--font-family-heading)] font-bold text-gray-900 mb-1">{proj.name}</h3>
                                        <p className="text-[length:calc(var(--font-size-body)*0.833)] font-[family-name:var(--font-family-body)] text-gray-600" style={{ marginBottom: 'var(--spacing-role-description, 4px)' }}>
                                            {Array.isArray(proj.description) ? proj.description[0] : proj.description}
                                        </p>
                                        {proj.technologies && (
                                            <div className="flex flex-wrap gap-1">
                                                {proj.technologies.slice(0, 4).map((tech, i) => (
                                                    <span key={i} className="text-[length:calc(var(--font-size-body)*0.667)] font-[family-name:var(--font-family-body)] px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded font-mono">
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
                <div className="w-[2.4in] bg-slate-800 text-white" style={{ padding: 'var(--margin-y, 1.5rem) var(--margin-x, 1.5rem)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-section, 16px)' }}>
                    {/* Skills */}
                    {data.skills && data.skills.length > 0 && (
                        <section style={{ order: data.sectionOrder?.indexOf('skills') ?? 99 }}>
                            <h2 className="text-[length:var(--font-size-heading)] font-[family-name:var(--font-family-heading)] [text-align:var(--align-heading)] font-bold uppercase tracking-wider text-emerald-400" style={{ marginBottom: 'var(--spacing-section-heading, 8px)' }}>
                                {'<'} Tech Stack {' />'}
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
                                              <h3 className="text-[length:var(--font-size-heading)] font-[family-name:var(--font-family-heading)] text-slate-400 uppercase tracking-wide" style={{ marginBottom: 0, whiteSpace: 'nowrap' }}>{cat.category}:</h3>
                                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: `${data.settings?.spacingSkillsItem ?? 4}px`, rowGap: '4px' }}>
                                                  {cat.skills.map((skill, i) => (
                                                      <span key={i} className="text-[length:calc(var(--font-size-body)*0.750)] font-[family-name:var(--font-family-body)] text-slate-300 font-mono">
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
                                              <h3 className="text-[length:var(--font-size-heading)] font-[family-name:var(--font-family-heading)] text-slate-400 uppercase tracking-wide" style={{ marginBottom: 0, whiteSpace: 'nowrap', marginRight: '6px' }}>{cat.category}:</h3>
                                              {cat.skills.map((skill, i) => (
                                                  <span key={i} className="text-[length:calc(var(--font-size-body)*0.750)] font-[family-name:var(--font-family-body)] text-slate-300 font-mono">
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
                            <h2 className="text-[length:var(--font-size-heading)] font-[family-name:var(--font-family-heading)] [text-align:var(--align-heading)] font-bold uppercase tracking-wider text-emerald-400" style={{ marginBottom: 'var(--spacing-section-heading, 8px)' }}>
                                <GraduationCap className="w-4 h-4 inline-block mr-1" /> Education
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-item, 10px)' }}>
                                {data.education.map((edu) => (
                                    <div key={edu.id}>
                                        <h3 className="text-[length:var(--font-size-heading)] font-[family-name:var(--font-family-heading)] font-bold text-white">{edu.degree}</h3>
                                        <p className="text-[length:calc(var(--font-size-body)*0.833)] font-[family-name:var(--font-family-body)] text-slate-400" style={{ marginTop: 'var(--spacing-role-company, 2px)' }}>{edu.institution}</p>
                                        <p className="text-[length:calc(var(--font-size-body)*0.750)] font-[family-name:var(--font-family-body)] text-slate-500">{edu.graduationDate}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Certifications */}
                    {data.certificates && data.certificates.length > 0 && (
                        <section style={{ order: data.sectionOrder?.indexOf('certificates') ?? 99 }}>
                            <h2 className="text-[length:var(--font-size-heading)] font-[family-name:var(--font-family-heading)] [text-align:var(--align-heading)] font-bold uppercase tracking-wider text-emerald-400" style={{ marginBottom: 'var(--spacing-section-heading, 8px)' }}>
                                <Award className="w-4 h-4 inline-block mr-1" /> Certifications
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-item, 6px)' }}>
                                {data.certificates.map((cert) => (
                                    <div key={cert.id} className="p-2 bg-slate-700/50 rounded">
                                        <p className="text-[length:calc(var(--font-size-body)*0.833)] font-[family-name:var(--font-family-body)] font-semibold text-white">{cert.name}</p>
                                        <p className="text-[length:calc(var(--font-size-body)*0.750)] font-[family-name:var(--font-family-body)] text-slate-400">{cert.issuer}</p>
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

export default ResumeTemplate13;
