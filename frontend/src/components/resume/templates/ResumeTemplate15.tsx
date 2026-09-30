import React from 'react';
import { TemplateResumeData } from '@/types/resume';
import { hasSummaryText, getSummaryContent } from './index';

interface ResumeTemplate15Props {
  data: TemplateResumeData;
}

// Executive Minimalist - Clean Centered Sections with Separator Lines
const ResumeTemplate15 = ({ data }: ResumeTemplate15Props) => {
  const align = data.settings?.headerAlignment || 'left';

  // Helper to format social links / website urls
  const formatUrl = (url: string) => {
    return url.replace(/^https?:\/\/(www\.)?/, '');
  };

  // Render Section Separator Line
  const renderSeparator = () => (
    <hr style={{ borderColor: '#000000', borderWidth: '1px', margin: 'var(--spacing-section, 16px) 0 0 0', borderStyle: 'solid' }} />
  );

  const sectionsToRender = data.sectionOrder || ['summary', 'skills', 'experience', 'education', 'projects', 'optional', 'certificates', 'awards', 'languages', 'publications', 'memberships', 'volunteer', 'customSections'];

  const renderSection = (sectionId: string, index: number, isFirst: boolean) => {
    switch (sectionId) {
      case 'summary':
        if (!hasSummaryText(data.summary)) return null;
        return (
          <div key="summary" style={{ order: index, display: 'flex', flexDirection: 'column' }}>
            {!isFirst && renderSeparator()}
            <h2 style={{
              textAlign: 'center',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              fontSize: 'calc(var(--font-size-heading) * 1.05)',
              margin: 'var(--spacing-section, 16px) 0 var(--spacing-section-heading, 8px) 0',
              color: '#000000',
              letterSpacing: '1px'
            }}>
              Professional Summary
            </h2>
            <div 
              style={{
                fontSize: 'var(--font-size-body, 10pt)',
                color: '#000000',
                lineHeight: 'var(--line-spacing, 1.4)',
                textAlign: 'justify'
              }}
              dangerouslySetInnerHTML={{ __html: getSummaryContent(data.summary) }}
            />
          </div>
        );

      case 'skills':
        if (!data.skills || data.skills.length === 0) return null;
        return (
          <div key="skills" style={{ order: index, display: 'flex', flexDirection: 'column' }}>
            {!isFirst && renderSeparator()}
            <h2 style={{
              textAlign: 'center',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              fontSize: 'calc(var(--font-size-heading) * 1.05)',
              margin: 'var(--spacing-section, 16px) 0 var(--spacing-section-heading, 8px) 0',
              color: '#000000',
              letterSpacing: '1px'
            }}>
              Skills Summary
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
                      <span style={{ fontWeight: 'bold', fontSize: 'var(--font-size-body, 10pt)', color: '#000000' }}>
                        • {cat.category}:
                      </span>
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: `${data.settings?.spacingSkillsItem ?? 8}px`,
                        rowGap: '4px',
                        fontSize: 'var(--font-size-body, 10pt)',
                        color: '#000000'
                      }}>
                        {cat.skills.map((skill, sIdx) => (
                          <span key={sIdx}>
                            {skill}{sIdx < cat.skills.length - 1 ? (data.settings?.skillsSeparator || ', ') : ''}
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
                      rowGap: '4px',
                      fontSize: 'var(--font-size-body, 10pt)',
                      color: '#000000'
                    }}>
                      <span style={{ fontWeight: 'bold', marginRight: '6px', color: '#000000' }}>
                        • {cat.category}:
                      </span>
                      {cat.skills.map((skill, sIdx) => (
                        <span key={sIdx}>
                          {skill}{sIdx < cat.skills.length - 1 ? (data.settings?.skillsSeparator || ', ') : ''}
                        </span>
                      ))}
                    </div>
                  );
                }
              })}
            </div>
          </div>
        );

      case 'experience':
        if (!data.experience || data.experience.length === 0) return null;
        return (
          <div key="experience" style={{ order: index, display: 'flex', flexDirection: 'column' }}>
            {!isFirst && renderSeparator()}
            <h2 style={{
              textAlign: 'center',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              fontSize: 'calc(var(--font-size-heading) * 1.05)',
              margin: 'var(--spacing-section, 16px) 0 var(--spacing-section-heading, 8px) 0',
              color: '#000000',
              letterSpacing: '1px'
            }}>
              Work Experience
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-item, 16px)' }}>
              {data.experience.map((exp) => (
                <div key={exp.id} style={{ display: 'flex', flexDirection: 'column' }}>
                  {/* Job Title and Date Header */}
                  <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'baseline', width: '100%', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontWeight: 'bold', fontSize: 'var(--font-size-body, 10pt)', color: '#000000' }}>
                        {exp.title} {exp.company ? `| ${exp.company}` : ''}
                      </span>
                      {(exp as any).link && (
                        <span style={{ fontSize: 'var(--font-size-body, 10pt)' }}>
                          {' '}|{' '}
                          <a href={(exp as any).link.startsWith('http') ? (exp as any).link : 'https://' + (exp as any).link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: '#0000EE', fontWeight: 'bold' }}>
                            LINK
                          </a>
                        </span>
                      )}
                    </div>
                    {((exp as any).date || exp.startDate || exp.endDate) && (
                      <span style={{ fontWeight: 'bold', fontSize: 'var(--font-size-body, 10pt)', color: '#000000', flexShrink: 0 }}>
                        {(exp as any).date || (exp.startDate && exp.endDate ? `${exp.startDate} – ${exp.endDate}` : (exp.startDate || exp.endDate || ''))}
                      </span>
                    )}
                  </div>

                  {/* Description points block */}
                  {exp.description && (
                    <ul className="list-disc list-outside" style={{
                      paddingLeft: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--spacing-list-items, 4px)',
                      marginTop: 'var(--spacing-role-description, 4px)',
                      fontSize: 'calc(var(--font-size-body) * 0.95)',
                      color: '#000000',
                      lineHeight: 'var(--line-spacing, 1.4)'
                    }}>
                      {Array.isArray(exp.description) ? (
                        exp.description.map((desc, i) => (
                          <li key={i} style={{ color: '#000000' }}>{desc}</li>
                        ))
                      ) : (
                        <li style={{ color: '#000000' }} dangerouslySetInnerHTML={{ __html: exp.description }} />
                      )}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'education':
        if (!data.education || data.education.length === 0) return null;
        return (
          <div key="education" style={{ order: index, display: 'flex', flexDirection: 'column' }}>
            {!isFirst && renderSeparator()}
            <h2 style={{
              textAlign: 'center',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              fontSize: 'calc(var(--font-size-heading) * 1.05)',
              margin: 'var(--spacing-section, 16px) 0 var(--spacing-section-heading, 8px) 0',
              color: '#000000',
              letterSpacing: '1px'
            }}>
              Education
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-item, 16px)' }}>
              {data.education.map((edu) => (
                <div key={edu.id} style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'baseline', width: '100%', gap: '16px' }}>
                    <div style={{ flex: 1, fontWeight: 'bold', fontSize: 'var(--font-size-body, 10pt)', color: '#000000' }}>
                      {edu.institution}
                    </div>
                    {(edu.graduationDate || (edu as any).date || (edu as any).startDate) && (
                      <span style={{ fontWeight: 'bold', fontSize: 'var(--font-size-body, 10pt)', color: '#000000', flexShrink: 0 }}>
                        {edu.graduationDate || (edu as any).date || (edu as any).startDate}
                      </span>
                    )}
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'between',
                    alignItems: 'baseline',
                    width: '100%',
                    gap: '16px',
                    marginTop: 'var(--spacing-role-company, 2px)',
                    fontSize: 'var(--font-size-body, 10pt)',
                    color: '#000000'
                  }}>
                    <div style={{ flex: 1 }}>
                      {edu.degree}{(edu as any).fieldOfStudy ? ` – ${(edu as any).fieldOfStudy}` : ''}
                    </div>
                    {edu.gpa && (
                      <span style={{ fontWeight: 'bold', flexShrink: 0 }}>
                        CGPA: {edu.gpa}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'projects':
      case 'optional':
        // Projects
        if (!data.projects || data.projects.length === 0) return null;
        return (
          <div key={sectionId} style={{ order: index, display: 'flex', flexDirection: 'column' }}>
            {!isFirst && renderSeparator()}
            <h2 style={{
              textAlign: 'center',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              fontSize: 'calc(var(--font-size-heading) * 1.05)',
              margin: 'var(--spacing-section, 16px) 0 var(--spacing-section-heading, 8px) 0',
              color: '#000000',
              letterSpacing: '1px'
            }}>
              Projects
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-item, 16px)' }}>
              {data.projects.map((proj) => (
                <div key={proj.id} style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'baseline', width: '100%', gap: '16px' }}>
                    <div style={{ flex: 1, fontWeight: 'bold', fontSize: 'var(--font-size-body, 10pt)', color: '#000000' }}>
                      {proj.name}
                      {proj.link && (
                        <span>
                          {' '}|{' '}
                          <a href={proj.link.startsWith('http') ? proj.link : 'https://' + proj.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: '#0000EE', fontWeight: 'bold' }}>
                            LINK
                          </a>
                        </span>
                      )}
                    </div>
                    {(proj.date || proj.startDate || proj.endDate) && (
                      <span style={{ fontWeight: 'bold', fontSize: 'var(--font-size-body, 10pt)', color: '#000000', flexShrink: 0 }}>
                        {proj.date || (proj.startDate && proj.endDate ? `${proj.startDate} – ${proj.endDate}` : (proj.startDate || proj.endDate || ''))}
                      </span>
                    )}
                  </div>
                  {!!((proj as any).techStack || proj.technologies?.length) && (
                    <div style={{
                      fontSize: 'calc(var(--font-size-body) * 0.95)',
                      marginTop: 'var(--spacing-role-company, 2px)',
                      color: '#000000'
                    }}>
                      <span style={{ fontWeight: 'bold' }}>Tech:</span> {(proj as any).techStack || proj.technologies?.join(', ')}
                    </div>
                  )}
                  {proj.description && (
                    <div style={{
                      marginTop: 'var(--spacing-role-description, 4px)',
                      fontSize: 'calc(var(--font-size-body) * 0.95)',
                      color: '#000000',
                      lineHeight: 'var(--line-spacing, 1.4)'
                    }}>
                      {Array.isArray(proj.description) ? (
                        <ul className="list-disc list-outside" style={{
                          paddingLeft: '20px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 'var(--spacing-list-items, 4px)'
                        }}>
                          {proj.description.map((desc, i) => (
                            <li key={i} style={{ color: '#000000' }}>{desc}</li>
                          ))}
                        </ul>
                      ) : (
                        <div dangerouslySetInnerHTML={{ __html: proj.description }} />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'certificates':
        // Certifications
        if (!data.certificates || data.certificates.length === 0) return null;
        return (
          <div key="certificates" style={{ order: index, display: 'flex', flexDirection: 'column' }}>
            {!isFirst && renderSeparator()}
            <h2 style={{
              textAlign: 'center',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              fontSize: 'calc(var(--font-size-heading) * 1.05)',
              margin: 'var(--spacing-section, 16px) 0 var(--spacing-section-heading, 8px) 0',
              color: '#000000',
              letterSpacing: '1px'
            }}>
              Certificates
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-item, 8px)' }}>
              {data.certificates.map((cert, cIdx) => (
                <div key={cert.id || cIdx} style={{ display: 'flex', justifyContent: 'between', alignItems: 'baseline', width: '100%', gap: '16px' }}>
                  <div style={{ flex: 1, fontSize: 'var(--font-size-body, 10pt)', color: '#000000' }}>
                    • <span style={{ fontWeight: 'bold' }}>{cert.name}</span> {cert.issuer ? `(${cert.issuer})` : ''}
                  </div>
                  {cert.date && (
                    <span style={{ fontWeight: 'bold', fontSize: 'var(--font-size-body, 10pt)', color: '#000000', flexShrink: 0 }}>
                      {cert.date}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'awards':
        if (!data.awards || data.awards.length === 0) return null;
        return (
          <div key="awards" style={{ order: index, display: 'flex', flexDirection: 'column' }}>
            {!isFirst && renderSeparator()}
            <h2 style={{
              textAlign: 'center',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              fontSize: 'calc(var(--font-size-heading) * 1.05)',
              margin: 'var(--spacing-section, 16px) 0 var(--spacing-section-heading, 8px) 0',
              color: '#000000',
              letterSpacing: '1px'
            }}>
              Awards & Achievements
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-item, 8px)' }}>
              {data.awards.map((award) => (
                <div key={award.id} style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'baseline', width: '100%', gap: '16px' }}>
                    <div style={{ flex: 1, fontSize: 'var(--font-size-body, 10pt)', color: '#000000' }}>
                      • <span style={{ fontWeight: 'bold' }}>{award.title}</span>
                    </div>
                    {award.date && (
                      <span style={{ fontWeight: 'bold', fontSize: 'var(--font-size-body, 10pt)', color: '#000000', flexShrink: 0 }}>
                        {award.date}
                      </span>
                    )}
                  </div>
                  {award.description && (
                    <div style={{
                      paddingLeft: '12px',
                      fontSize: 'calc(var(--font-size-body) * 0.95)',
                      color: '#000000',
                      lineHeight: 'var(--line-spacing, 1.4)',
                      marginTop: '2px'
                    }}>
                      {award.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'languages':
        if (!data.languages || data.languages.length === 0) return null;
        return (
          <div key="languages" style={{ order: index, display: 'flex', flexDirection: 'column' }}>
            {!isFirst && renderSeparator()}
            <h2 style={{
              textAlign: 'center',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              fontSize: 'calc(var(--font-size-heading) * 1.05)',
              margin: 'var(--spacing-section, 16px) 0 var(--spacing-section-heading, 8px) 0',
              color: '#000000',
              letterSpacing: '1px'
            }}>
              Languages
            </h2>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '24px',
              fontSize: 'var(--font-size-body, 10pt)',
              color: '#000000'
            }}>
              {data.languages.map((lang) => (
                <div key={lang.id} style={{ display: 'flex', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 'bold' }}>{lang.language}</span>
                  {lang.proficiency && (
                    <span style={{ color: '#555555', marginLeft: '6px', fontSize: '9pt' }}>
                      ({lang.proficiency})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'publications':
        if (!data.publications || data.publications.length === 0) return null;
        return (
          <div key="publications" style={{ order: index, display: 'flex', flexDirection: 'column' }}>
            {!isFirst && renderSeparator()}
            <h2 style={{
              textAlign: 'center',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              fontSize: 'calc(var(--font-size-heading) * 1.05)',
              margin: 'var(--spacing-section, 16px) 0 var(--spacing-section-heading, 8px) 0',
              color: '#000000',
              letterSpacing: '1px'
            }}>
              Publications
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-item, 12px)' }}>
              {data.publications.map((pub) => (
                <div key={pub.id} style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'baseline', width: '100%', gap: '16px' }}>
                    <div style={{ flex: 1, fontWeight: 'bold', fontSize: 'var(--font-size-body, 10pt)', color: '#000000' }}>
                      {pub.title}
                      {pub.url && (
                        <span>
                          {' '}|{' '}
                          <a href={pub.url.startsWith('http') ? pub.url : 'https://' + pub.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: '#0000EE', fontWeight: 'bold' }}>
                            LINK
                          </a>
                        </span>
                      )}
                    </div>
                    {pub.date && (
                      <span style={{ fontWeight: 'bold', fontSize: 'var(--font-size-body, 10pt)', color: '#000000', flexShrink: 0 }}>
                        {pub.date}
                      </span>
                    )}
                  </div>
                  <div style={{
                    fontSize: 'calc(var(--font-size-body) * 0.95)',
                    marginTop: 'var(--spacing-role-company, 2px)',
                    color: '#000000'
                  }}>
                    {pub.authors}{pub.journal ? ` – ${pub.journal}` : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'memberships':
        if (!data.memberships || data.memberships.length === 0) return null;
        return (
          <div key="memberships" style={{ order: index, display: 'flex', flexDirection: 'column' }}>
            {!isFirst && renderSeparator()}
            <h2 style={{
              textAlign: 'center',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              fontSize: 'calc(var(--font-size-heading) * 1.05)',
              margin: 'var(--spacing-section, 16px) 0 var(--spacing-section-heading, 8px) 0',
              color: '#000000',
              letterSpacing: '1px'
            }}>
              Professional Memberships
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-item, 12px)' }}>
              {data.memberships.map((mem) => (
                <div key={mem.id} style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'baseline', width: '100%', gap: '16px' }}>
                    <div style={{ flex: 1, fontWeight: 'bold', fontSize: 'var(--font-size-body, 10pt)', color: '#000000' }}>
                      {mem.organization}
                    </div>
                    {(mem.startDate || mem.endDate) && (
                      <span style={{ fontWeight: 'bold', fontSize: 'var(--font-size-body, 10pt)', color: '#000000', flexShrink: 0 }}>
                        {mem.startDate && mem.endDate ? `${mem.startDate} – ${mem.endDate}` : (mem.startDate || mem.endDate)}
                      </span>
                    )}
                  </div>
                  {mem.role && (
                    <div style={{
                      fontSize: 'calc(var(--font-size-body) * 0.95)',
                      marginTop: 'var(--spacing-role-company, 2px)',
                      color: '#000000'
                    }}>
                      {mem.role}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'volunteer':
        if (!data.volunteer || data.volunteer.length === 0) return null;
        return (
          <div key="volunteer" style={{ order: index, display: 'flex', flexDirection: 'column' }}>
            {!isFirst && renderSeparator()}
            <h2 style={{
              textAlign: 'center',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              fontSize: 'calc(var(--font-size-heading) * 1.05)',
              margin: 'var(--spacing-section, 16px) 0 var(--spacing-section-heading, 8px) 0',
              color: '#000000',
              letterSpacing: '1px'
            }}>
              Volunteer Experience
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-item, 16px)' }}>
              {data.volunteer.map((vol) => (
                <div key={vol.id} style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'baseline', width: '100%', gap: '16px' }}>
                    <div style={{ flex: 1, fontWeight: 'bold', fontSize: 'var(--font-size-body, 10pt)', color: '#000000' }}>
                      {vol.role} {vol.organization ? `| ${vol.organization}` : ''}
                    </div>
                    {(vol.startDate || vol.endDate) && (
                      <span style={{ fontWeight: 'bold', fontSize: 'var(--font-size-body, 10pt)', color: '#000000', flexShrink: 0 }}>
                        {vol.startDate && vol.endDate ? `${vol.startDate} – ${vol.endDate}` : (vol.startDate || vol.endDate)}
                      </span>
                    )}
                  </div>
                  {vol.description && (
                    <div style={{
                      marginTop: 'var(--spacing-role-description, 4px)',
                      fontSize: 'calc(var(--font-size-body) * 0.95)',
                      color: '#000000',
                      lineHeight: 'var(--line-spacing, 1.4)'
                    }}>
                      {vol.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'customSections':
        if (!data.customSections || data.customSections.length === 0) return null;
        return (
          <>
            {data.customSections.map((section, sIdx) => (
              <div key={section.id} style={{ order: index, display: 'flex', flexDirection: 'column' }}>
                {(!isFirst || sIdx > 0) && renderSeparator()}
                <h2 style={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  fontSize: 'calc(var(--font-size-heading) * 1.05)',
                  margin: 'var(--spacing-section, 16px) 0 var(--spacing-section-heading, 8px) 0',
                  color: '#000000',
                  letterSpacing: '1px'
                }}>
                  {section.title}
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-item, 16px)' }}>
                  {section.items.map((item) => (
                    <div key={item.id} style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'baseline', width: '100%', gap: '16px' }}>
                        <div style={{ flex: 1, fontWeight: 'bold', fontSize: 'var(--font-size-body, 10pt)', color: '#000000' }}>
                          {item.title}
                        </div>
                        {item.date && (
                          <span style={{ fontWeight: 'bold', fontSize: 'var(--font-size-body, 10pt)', color: '#000000', flexShrink: 0 }}>
                            {item.date}
                          </span>
                        )}
                      </div>
                      {item.subtitle && (
                        <div style={{
                          fontSize: 'calc(var(--font-size-body) * 0.95)',
                          marginTop: 'var(--spacing-role-company, 2px)',
                          color: '#000000'
                        }}>
                          {item.subtitle}
                        </div>
                      )}
                      {item.description && item.description.length > 0 && (
                        <ul className="list-disc list-outside" style={{
                          paddingLeft: '20px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 'var(--spacing-list-items, 4px)',
                          marginTop: 'var(--spacing-role-description, 4px)',
                          fontSize: 'calc(var(--font-size-body) * 0.95)',
                          color: '#000000',
                          lineHeight: 'var(--line-spacing, 1.4)'
                        }}>
                          {item.description.map((desc, i) => (
                            <li key={i} style={{ color: '#000000' }}>{desc}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        );

      default:
        return null;
    }
  };

  // Filter out any sections that are completely empty so we don't put extra hr lines
  const activeSections = sectionsToRender.filter((sec) => {
    if (sec === 'summary') return hasSummaryText(data.summary);
    if (sec === 'skills') return data.skills && data.skills.length > 0;
    if (sec === 'experience') return data.experience && data.experience.length > 0;
    if (sec === 'education') return data.education && data.education.length > 0;
    if (sec === 'optional' || sec === 'projects') return data.projects && data.projects.length > 0;
    if (sec === 'certificates') return data.certificates && data.certificates.length > 0;
    if (sec === 'awards') return data.awards && data.awards.length > 0;
    if (sec === 'languages') return data.languages && data.languages.length > 0;
    if (sec === 'publications') return data.publications && data.publications.length > 0;
    if (sec === 'memberships') return data.memberships && data.memberships.length > 0;
    if (sec === 'volunteer') return data.volunteer && data.volunteer.length > 0;
    if (sec === 'customSections') return data.customSections && data.customSections.length > 0;
    return false;
  });

  return (
    <div className="resume-page bg-white" style={{
      padding: 'var(--margin-y, 0.6in) var(--margin-x, 0.6in)',
      display: 'flex',
      flexDirection: 'column',
      color: '#000000',
      backgroundColor: '#ffffff'
    }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: align === 'center' ? 'center' : (align === 'right' ? 'flex-end' : 'flex-start'),
        gap: 'var(--spacing-title-contact, 8px)',
        width: '100%',
        borderBottom: '1px solid #000000',
        paddingBottom: 'var(--spacing-title-contact, 8px)'
      }}>
        {/* Top Row: Name on Left, details on right if Left-aligned */}
        {align === 'left' ? (
          <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'start', width: '100%', gap: '20px' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-name-title, 4px)' }}>
              <h1 style={{ fontSize: 'var(--font-size-name, 22pt)', fontWeight: 'bold', margin: 0, color: '#000000', lineHeight: 1.1 }}>
                {data.personalInfo?.name || 'Your Name'}
              </h1>
              {data.personalInfo?.title && (
                <p style={{ fontSize: 'calc(var(--font-size-body)*1.1)', fontWeight: 'bold', margin: 0, color: '#333333' }}>
                  {data.personalInfo.title}
                </p>
              )}
              {/* Left-aligned social links */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: 'var(--font-size-body, 9.5pt)', marginTop: '4px' }}>
                {data.personalInfo?.contact?.socialLinks?.map((link) => {
                  return (
                    <span key={link.id}>
                      <span style={{ fontWeight: 'bold' }}>{link.platform}:</span>{' '}
                      <a href={link.url.startsWith('http') ? link.url : 'https://' + link.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: '#0000EE' }}>
                        {formatUrl(link.url)}
                      </a>
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Right side contact info */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'end',
              textAlign: 'right',
              gap: '3px',
              fontSize: 'var(--font-size-body, 9.5pt)',
              flexShrink: 0
            }}>
              {data.personalInfo?.contact?.email && (
                <div>
                  <span style={{ fontWeight: 'bold' }}>Email:</span> {data.personalInfo.contact.email}
                </div>
              )}
              {data.personalInfo?.contact?.phone && (
                <div>
                  <span style={{ fontWeight: 'bold' }}>Mobile:</span> {data.personalInfo.contact.phone}
                </div>
              )}
              {data.personalInfo?.contact?.location && (
                <div>
                  <span style={{ fontWeight: 'bold' }}>Location:</span> {data.personalInfo.contact.location}
                </div>
              )}
            </div>
          </div>
        ) : (
          // Centered or Right aligned fallback
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: align === 'center' ? 'center' : 'flex-end',
            textAlign: align as any,
            width: '100%',
            gap: 'var(--spacing-title-contact, 8px)'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-name-title, 4px)', alignItems: align === 'center' ? 'center' : 'flex-end' }}>
              <h1 style={{ fontSize: 'var(--font-size-name, 22pt)', fontWeight: 'bold', margin: 0, color: '#000000', lineHeight: 1.1 }}>
                {data.personalInfo?.name || 'Your Name'}
              </h1>
              {data.personalInfo?.title && (
                <p style={{ fontSize: 'calc(var(--font-size-body)*1.1)', fontWeight: 'bold', margin: 0, color: '#333333' }}>
                  {data.personalInfo.title}
                </p>
              )}
            </div>

            {/* Flat wrap items for centered/right links */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: align === 'center' ? 'center' : 'flex-end',
              gap: '12px',
              fontSize: 'var(--font-size-body, 9.5pt)',
              width: '100%'
            }}>
              {data.personalInfo?.contact?.email && (
                <span><span style={{ fontWeight: 'bold' }}>Email:</span> {data.personalInfo.contact.email}</span>
              )}
              {data.personalInfo?.contact?.phone && (
                <span><span style={{ fontWeight: 'bold' }}>Mobile:</span> {data.personalInfo.contact.phone}</span>
              )}
              {data.personalInfo?.contact?.location && (
                <span><span style={{ fontWeight: 'bold' }}>Location:</span> {data.personalInfo.contact.location}</span>
              )}
              {data.personalInfo?.contact?.socialLinks?.map((link) => (
                <span key={link.id}>
                  <span style={{ fontWeight: 'bold' }}>{link.platform}:</span>{' '}
                  <a href={link.url.startsWith('http') ? link.url : 'https://' + link.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: '#0000EE' }}>
                    {formatUrl(link.url)}
                  </a>
                </span>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Sections Rendered in order */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {activeSections.map((sec, idx) => renderSection(sec, idx, idx === 0))}
      </div>

      {/* Global CSS block to override bullet points & list margins strictly based on settings */}
      <style>{`
        /* Override bullet margin list spacing */
        .bullet-gap-override ul {
          list-style-type: disc !important;
          padding-left: 20px !important;
          margin-top: var(--spacing-role-description, 4px) !important;
          margin-bottom: 0 !important;
        }
        .bullet-gap-override li {
          margin-bottom: var(--spacing-list-items, 4px) !important;
          color: #000000 !important;
        }
        .bullet-gap-override li:last-child {
          margin-bottom: 0 !important;
        }
        .bullet-gap-override p {
          margin: 0 !important;
          color: #000000 !important;
        }
      `}</style>
    </div>
  );
};

export default ResumeTemplate15;
