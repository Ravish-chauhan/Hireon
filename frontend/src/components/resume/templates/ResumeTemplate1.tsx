import { TemplateResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Linkedin, Github, Globe, Twitter, Link } from 'lucide-react';

interface ResumeTemplate1Props {
  data: TemplateResumeData;
}

const ResumeTemplate1 = ({ data }: ResumeTemplate1Props) => {
  const align = data.settings?.headerAlignment || 'left';
  return (
    <div className="resume-page bg-white" style={{
      padding: 'var(--margin-y, 0.6in) var(--margin-x, 0.6in)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-section, 16px)'
    }}>
      {/* Header */}
      <header className="pb-4 border-b-2 border-gray-400" style={{
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
          gap: '16px',
          justifyContent: align === 'center' ? 'center' : (align === 'right' ? 'flex-end' : 'flex-start'),
          width: '100%'
        }}>
          {data.personalInfo?.image && (
            <div className="flex-shrink-0">
              <img
                src={data.personalInfo.image}
                alt={data.personalInfo?.name || 'Profile'}
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
              />
            </div>
          )}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: align === 'center' ? 'center' : (align === 'right' ? 'flex-end' : 'flex-start'),
            gap: 'var(--spacing-name-title, 6px)'
          }}>
            <h1 className="text-[length:var(--font-size-name)] font-[family-name:var(--font-family-name)] font-bold text-gray-900 leading-tight" style={{ margin: 0, textAlign: align as any }}>
              {data.personalInfo?.name || 'Your Name'}
            </h1>
            {data.personalInfo?.title && (
              <p className="text-[length:var(--font-size-heading)] font-[family-name:var(--font-family-heading)] text-blue-600 font-semibold" style={{ margin: 0, textAlign: align as any }}>
                {data.personalInfo.title}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[length:calc(var(--font-size-body)*1.000)] font-[family-name:var(--font-family-body)] text-gray-700" style={{
          justifyContent: align === 'center' ? 'center' : (align === 'right' ? 'flex-end' : 'flex-start'),
          width: '100%'
        }}>
          {data.personalInfo?.contact?.email && (
            <span className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" /> {data.personalInfo.contact.email}
            </span>
          )}
          {data.personalInfo?.contact?.phone && (
            <span className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-600" /> {data.personalInfo.contact.phone}
            </span>
          )}
          {data.personalInfo?.contact?.location && (
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" /> {data.personalInfo.contact.location}
            </span>
          )}
          {data.personalInfo?.contact?.socialLinks?.map((link) => {
            const Icon = link.platform.toLowerCase() === 'linkedin' ? Linkedin :
              link.platform.toLowerCase() === 'github' ? Github :
                link.platform.toLowerCase() === 'twitter' ? Twitter :
                  link.platform.toLowerCase() === 'portfolio' ? Globe : Link;
            return (
              <span key={link.id} className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-blue-600" />
                <a href={link.url.startsWith('http') ? link.url : 'https://' + link.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {data.personalInfo?.contact?.socialLinksFormat === 'url' ? link.url.replace(/^https?:\/\//, '') : link.platform}
                </a>
              </span>
            );
          })}
        </div>
      </header>

      {/* Summary */}
      {data.summary && (
        <section style={{ order: data.sectionOrder?.indexOf('summary') ?? 99 }}>
          <h2 className="text-[length:var(--font-size-heading)] font-[family-name:var(--font-family-heading)] [text-align:var(--align-heading)] font-bold uppercase tracking-wider text-gray-900 border-b-2 border-gray-400 pb-1" style={{ marginBottom: 'var(--spacing-section-heading, 8px)' }}>
            Professional Summary
          </h2>
          <div className="text-[length:calc(var(--font-size-body)*1.083)] font-[family-name:var(--font-family-body)] leading-relaxed text-gray-700" dangerouslySetInnerHTML={{ __html: data.summary }} />
        </section>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <section style={{ order: data.sectionOrder?.indexOf('experience') ?? 99 }}>
          <h2 className="text-[length:var(--font-size-heading)] font-[family-name:var(--font-family-heading)] [text-align:var(--align-heading)] font-bold uppercase tracking-wider text-gray-900 border-b-2 border-gray-400 pb-1" style={{ marginBottom: 'var(--spacing-section-heading, 8px)' }}>
            Professional Experience
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-item, 12px)' }}>
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-[length:calc(var(--font-size-body)*1.250)] font-[family-name:var(--font-family-body)] font-bold text-gray-900">{exp.title}</h3>
                    <p className="text-[length:calc(var(--font-size-body)*1.083)] font-[family-name:var(--font-family-body)] text-blue-600 font-semibold" style={{ marginTop: 'var(--spacing-role-company, 2px)' }}>{exp.company}{exp.location && `, ${exp.location}`}</p>
                  </div>
                  <p className="text-[length:calc(var(--font-size-body)*1.000)] font-[family-name:var(--font-family-body)] text-gray-600 font-medium text-right">{exp.startDate} – {exp.endDate}</p>
                </div>
                {exp.description && exp.description.length > 0 && (
                  <ul className="list-disc list-outside ml-4 text-[length:calc(var(--font-size-body)*1.000)] font-[family-name:var(--font-family-body)] text-gray-700 leading-relaxed" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-list-items, 2px)', marginTop: 'var(--spacing-role-description, 6px)' }}>
                    {exp.description.map((desc, i) => (
                      <li key={i}>{desc}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <section style={{ order: data.sectionOrder?.indexOf('skills') ?? 99 }}>
          <h2 className="text-[length:var(--font-size-heading)] font-[family-name:var(--font-family-heading)] [text-align:var(--align-heading)] font-bold uppercase tracking-wider text-gray-900 border-b-2 border-gray-400 pb-1" style={{ marginBottom: 'var(--spacing-section-heading, 8px)' }}>
            Technical Skills
          </h2>
          <div style={{ 
            display: data.settings?.skillsLayout === 'two-column' ? 'grid' : 'flex',
            gridTemplateColumns: data.settings?.skillsLayout === 'two-column' ? '1fr 1fr' : undefined,
            columnGap: data.settings?.skillsLayout === 'two-column' ? '32px' : undefined,
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
                    <span className="text-[length:calc(var(--font-size-body)*1.083)] font-[family-name:var(--font-family-body)] font-bold text-gray-900" style={{ whiteSpace: 'nowrap' }}>{cat.category}: </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: `${data.settings?.spacingSkillsItem ?? 8}px`, rowGap: '4px' }} className="text-[length:calc(var(--font-size-body)*1.000)] font-[family-name:var(--font-family-body)] text-gray-700">
                      {cat.skills.map((skill, index) => (
                        <span key={index}>
                          {skill}{index < cat.skills.length - 1 ? (data.settings?.skillsSeparator || ' • ') : ''}
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
                    columnGap: `${data.settings?.spacingSkillsItem ?? 8}px`,
                    rowGap: '4px'
                  }} className="text-[length:calc(var(--font-size-body)*1.000)] font-[family-name:var(--font-family-body)] text-gray-700">
                    <span className="text-[length:calc(var(--font-size-body)*1.083)] font-[family-name:var(--font-family-body)] font-bold text-gray-900" style={{ whiteSpace: 'nowrap', marginRight: '6px' }}>{cat.category}:</span>
                    {cat.skills.map((skill, index) => (
                      <span key={index} className="text-[length:calc(var(--font-size-body)*1.000)] font-[family-name:var(--font-family-body)] text-gray-700">
                        {skill}{index < cat.skills.length - 1 ? (data.settings?.skillsSeparator || ' • ') : ''}
                      </span>
                    ))}
                  </div>
                );
              }
            })}
          </div>
        </section>
      )}

      {/* Certificates */}
      {data.certificates && data.certificates.length > 0 && (
        <section style={{ order: data.sectionOrder?.indexOf('certificates') ?? 99 }}>
          <h2 className="text-[length:var(--font-size-heading)] font-[family-name:var(--font-family-heading)] [text-align:var(--align-heading)] font-bold uppercase tracking-wider text-gray-900 border-b-2 border-gray-400 pb-1" style={{ marginBottom: 'var(--spacing-section-heading, 8px)' }}>
            Certifications
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-item, 6px)' }}>
            {data.certificates.map((cert) => (
              <div key={cert.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[length:calc(var(--font-size-body)*1.083)] font-[family-name:var(--font-family-body)] font-bold text-gray-900">{cert.name}</h3>
                  <span className="text-[length:calc(var(--font-size-body)*1.000)] font-[family-name:var(--font-family-body)] text-gray-600">{cert.date}</span>
                </div>
                <p className="text-[length:calc(var(--font-size-body)*1.000)] font-[family-name:var(--font-family-body)] text-gray-600">{cert.issuer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Awards */}
      {data.awards && data.awards.length > 0 && (
        <section style={{ order: data.sectionOrder?.indexOf('awards') ?? 99 }}>
          <h2 className="text-[length:var(--font-size-heading)] font-[family-name:var(--font-family-heading)] [text-align:var(--align-heading)] font-bold uppercase tracking-wider text-gray-900 border-b-2 border-gray-400 pb-1" style={{ marginBottom: 'var(--spacing-section-heading, 8px)' }}>
            Awards & Accomplishments
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-item, 6px)' }}>
            {data.awards.map((award) => (
              <div key={award.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[length:calc(var(--font-size-body)*1.083)] font-[family-name:var(--font-family-body)] font-bold text-gray-900">{award.title}</h3>
                  <span className="text-[length:calc(var(--font-size-body)*1.000)] font-[family-name:var(--font-family-body)] text-gray-600">{award.date}</span>
                </div>
                {award.description && (
                  <p className="text-[length:calc(var(--font-size-body)*1.000)] font-[family-name:var(--font-family-body)] text-gray-700 mt-1">{award.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {data.languages && data.languages.length > 0 && (
        <section style={{ order: data.sectionOrder?.indexOf('languages') ?? 99 }}>
          <h2 className="text-[length:var(--font-size-heading)] font-[family-name:var(--font-family-heading)] [text-align:var(--align-heading)] font-bold uppercase tracking-wider text-gray-900 border-b-2 border-gray-400 pb-1" style={{ marginBottom: 'var(--spacing-section-heading, 8px)' }}>
            Languages
          </h2>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {data.languages.map((lang) => (
              <div key={lang.id} className="flex justify-between items-center">
                <span className="text-[length:calc(var(--font-size-body)*1.083)] font-[family-name:var(--font-family-body)] font-bold text-gray-900">{lang.language}</span>
                <span className="text-[length:calc(var(--font-size-body)*1.000)] font-[family-name:var(--font-family-body)] text-gray-600 ml-2">{lang.proficiency}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Publications */}
      {data.publications && data.publications.length > 0 && (
        <section style={{ order: data.sectionOrder?.indexOf('publications') ?? 99 }}>
          <h2 className="text-[length:var(--font-size-heading)] font-[family-name:var(--font-family-heading)] [text-align:var(--align-heading)] font-bold uppercase tracking-wider text-gray-900 border-b-2 border-gray-400 pb-1" style={{ marginBottom: 'var(--spacing-section-heading, 8px)' }}>
            Publications
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-item, 8px)' }}>
            {data.publications.map((pub) => (
              <div key={pub.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[length:calc(var(--font-size-body)*1.083)] font-[family-name:var(--font-family-body)] font-bold text-gray-900">{pub.title}</h3>
                  <span className="text-[length:calc(var(--font-size-body)*1.000)] font-[family-name:var(--font-family-body)] text-gray-600">{pub.date}</span>
                </div>
                <p className="text-[length:calc(var(--font-size-body)*1.000)] font-[family-name:var(--font-family-body)] text-gray-600">{pub.authors}</p>
                <p className="text-[length:calc(var(--font-size-body)*1.000)] font-[family-name:var(--font-family-body)] text-gray-600 italic">{pub.journal}</p>
                {pub.url && (
                  <p className="text-[length:calc(var(--font-size-body)*0.917)] font-[family-name:var(--font-family-body)] text-blue-600">{pub.url}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Memberships */}
      {data.memberships && data.memberships.length > 0 && (
        <section style={{ order: data.sectionOrder?.indexOf('memberships') ?? 99 }}>
          <h2 className="text-[length:var(--font-size-heading)] font-[family-name:var(--font-family-heading)] [text-align:var(--align-heading)] font-bold uppercase tracking-wider text-gray-900 border-b-2 border-gray-400 pb-1" style={{ marginBottom: 'var(--spacing-section-heading, 8px)' }}>
            Professional Memberships
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-item, 6px)' }}>
            {data.memberships.map((mem) => (
              <div key={mem.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[length:calc(var(--font-size-body)*1.083)] font-[family-name:var(--font-family-body)] font-bold text-gray-900">{mem.organization}</h3>
                  <span className="text-[length:calc(var(--font-size-body)*1.000)] font-[family-name:var(--font-family-body)] text-gray-600">{mem.startDate} – {mem.endDate}</span>
                </div>
                {mem.role && (
                  <p className="text-[length:calc(var(--font-size-body)*1.000)] font-[family-name:var(--font-family-body)] text-gray-600">{mem.role}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Volunteer */}
      {data.volunteer && data.volunteer.length > 0 && (
        <section style={{ order: data.sectionOrder?.indexOf('volunteer') ?? 99 }}>
          <h2 className="text-[length:var(--font-size-heading)] font-[family-name:var(--font-family-heading)] [text-align:var(--align-heading)] font-bold uppercase tracking-wider text-gray-900 border-b-2 border-gray-400 pb-1" style={{ marginBottom: 'var(--spacing-section-heading, 8px)' }}>
            Volunteer Experience
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-item, 12px)' }}>
            {data.volunteer.map((vol) => (
              <div key={vol.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-[length:calc(var(--font-size-body)*1.250)] font-[family-name:var(--font-family-body)] font-bold text-gray-900">{vol.role}</h3>
                    <p className="text-[length:calc(var(--font-size-body)*1.083)] font-[family-name:var(--font-family-body)] text-blue-600 font-semibold" style={{ marginTop: 'var(--spacing-role-company, 2px)' }}>{vol.organization}</p>
                  </div>
                  <p className="text-[length:calc(var(--font-size-body)*1.000)] font-[family-name:var(--font-family-body)] text-gray-600 text-right">{vol.startDate} – {vol.endDate}</p>
                </div>
                {vol.description && (
                  <p className="text-[length:calc(var(--font-size-body)*1.000)] font-[family-name:var(--font-family-body)] text-gray-700" style={{ marginTop: 'var(--spacing-role-description, 4px)' }}>{vol.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section style={{ order: data.sectionOrder?.indexOf('education') ?? 99 }}>
          <h2 className="text-[length:var(--font-size-heading)] font-[family-name:var(--font-family-heading)] [text-align:var(--align-heading)] font-bold uppercase tracking-wider text-gray-900 border-b-2 border-gray-400 pb-1" style={{ marginBottom: 'var(--spacing-section-heading, 8px)' }}>
            Education
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-item, 12px)' }}>
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-[length:calc(var(--font-size-body)*1.250)] font-[family-name:var(--font-family-body)] font-bold text-gray-900">{edu.degree}</h3>
                    <p className="text-[length:calc(var(--font-size-body)*1.083)] font-[family-name:var(--font-family-body)] text-gray-600 font-medium" style={{ marginTop: 'var(--spacing-role-company, 2px)' }}>{edu.institution}{edu.location && `, ${edu.location}`}</p>
                    {edu.gpa && (
                      <p className="text-[length:calc(var(--font-size-body)*1.000)] font-[family-name:var(--font-family-body)] text-gray-500">GPA: {edu.gpa}</p>
                    )}
                  </div>
                  <p className="text-[length:calc(var(--font-size-body)*1.000)] font-[family-name:var(--font-family-body)] text-gray-600">{edu.graduationDate}</p>
                </div>
                {edu.description && edu.description.length > 0 && (
                  <ul className="list-disc list-outside ml-4 text-[length:calc(var(--font-size-body)*1.000)] font-[family-name:var(--font-family-body)] text-gray-700 leading-relaxed" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-list-items, 2px)', marginTop: 'var(--spacing-role-description, 6px)' }}>
                    {edu.description.map((desc, i) => (
                      <li key={i}>{desc}</li>
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
          <h2 className="text-[length:var(--font-size-heading)] font-[family-name:var(--font-family-heading)] [text-align:var(--align-heading)] font-bold uppercase tracking-wider text-gray-900 border-b-2 border-gray-400 pb-1" style={{ marginBottom: 'var(--spacing-section-heading, 8px)' }}>
            Projects
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-item, 12px)' }}>
            {data.projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-[length:calc(var(--font-size-body)*1.250)] font-[family-name:var(--font-family-body)] font-bold text-gray-900">{proj.name}</h3>
                    {proj.role && (
                      <p className="text-[length:calc(var(--font-size-body)*1.083)] font-[family-name:var(--font-family-body)] text-blue-600 font-semibold" style={{ marginTop: 'var(--spacing-role-company, 2px)' }}>{proj.role}</p>
                    )}
                    {proj.link && (
                      <p className="text-[length:calc(var(--font-size-body)*0.917)] font-[family-name:var(--font-family-body)] text-blue-600">{proj.link}</p>
                    )}
                  </div>
                  <p className="text-[length:calc(var(--font-size-body)*1.000)] font-[family-name:var(--font-family-body)] text-gray-600 text-right">
                    {proj.startDate && proj.endDate ? `${proj.startDate} – ${proj.endDate}` : proj.date}
                  </p>
                </div>
                {proj.description && (
                  Array.isArray(proj.description) ? (
                    proj.description.length > 0 && (
                      <ul className="list-disc list-outside ml-4 text-[length:calc(var(--font-size-body)*1.000)] font-[family-name:var(--font-family-body)] text-gray-700 leading-relaxed" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-list-items, 2px)', marginTop: 'var(--spacing-role-description, 6px)' }}>
                        {proj.description.map((desc, i) => (
                          <li key={i}>{desc}</li>
                        ))}
                      </ul>
                    )
                  ) : (
                    <p className="text-[length:calc(var(--font-size-body)*1.000)] font-[family-name:var(--font-family-body)] text-gray-700" style={{ marginTop: 'var(--spacing-role-description, 4px)' }}>{proj.description}</p>
                  )
                )}
                {proj.technologies && proj.technologies.length > 0 && (
                  <p className="text-[length:calc(var(--font-size-body)*0.917)] font-[family-name:var(--font-family-body)] text-blue-500 mt-2 font-medium">{proj.technologies.join(' • ')}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ResumeTemplate1;
