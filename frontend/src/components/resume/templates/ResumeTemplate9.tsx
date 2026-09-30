import { TemplateResumeData } from '@/types/resume';
import { hasSummaryText, getSummaryContent } from './index';

interface ResumeTemplate9Props {
  data: TemplateResumeData;
}

const ResumeTemplate9 = ({ data }: ResumeTemplate9Props) => {
  const accentColor = "#0d9488";

  const align = data.settings?.headerAlignment || 'left';
  return (
    <div className="resume-page w-[850px] min-h-[1100px] bg-white overflow-hidden flex"
      style={{
        fontFamily: "var(--font-family-body, 'Inter'), sans-serif",
        fontSize: 'var(--font-size-body, 9pt)',
        lineHeight: 'var(--line-spacing, 1.4)',
        color: '#1f2937',
        boxSizing: 'border-box'
      }}>

      {/* Sidebar */}
      <div style={{
        width: '240px',
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        padding: 'var(--margin-y, 0.4in) var(--margin-x, 0.3in)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-section, 14px)'
      }}>
        {/* Header Wrapper */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-title-contact, 8px)',
          width: '100%'
        }}>
          {/* Name & Title */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: align === 'center' ? 'center' : (align === 'right' ? 'flex-end' : 'flex-start'),
            textAlign: align as any,
            gap: 'var(--spacing-name-title, 6px)',
            width: '100%'
          }}>
            <div style={{
              fontSize: 'var(--font-size-name, 14pt)',
              fontFamily: "var(--font-family-name, 'Inter'), sans-serif",
              fontWeight: 700,
              color: '#ffffff',
              margin: 0,
              textAlign: align as any
            }}>
              {data.personalInfo?.name || 'Your Name'}
            </div>
            {data.personalInfo?.title && (
              <div style={{
                fontSize: 'var(--font-size-heading, 9pt)',
                fontFamily: "var(--font-family-heading, 'Inter'), sans-serif",
                color: accentColor,
                fontWeight: 500,
                margin: 0,
                textAlign: align as any
              }}>
                {data.personalInfo.title}
              </div>
            )}
          </div>

          {/* Contact */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: align === 'center' ? 'center' : (align === 'right' ? 'flex-end' : 'flex-start'),
            textAlign: align as any
          }}>
            <div style={{
              fontSize: 'var(--font-size-heading, 8pt)',
              fontFamily: "var(--font-family-heading, 'Inter'), sans-serif",
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              color: accentColor,
              marginBottom: 'var(--spacing-section-heading, 6px)',
              textAlign: align as any
            }}>
              Contact
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-list-items, 4px)',
              alignItems: align === 'center' ? 'center' : (align === 'right' ? 'flex-end' : 'flex-start'),
              textAlign: align as any,
              width: '100%'
            }}>
              {data.personalInfo?.contact?.email && (
                <div style={{ fontSize: '7.5pt', color: '#cbd5e1', wordBreak: 'break-word' }}>
                  {data.personalInfo.contact.email}
                </div>
              )}
              {data.personalInfo?.contact?.phone && (
                <div style={{ fontSize: '7.5pt', color: '#cbd5e1', wordBreak: 'break-word' }}>
                  {data.personalInfo.contact.phone}
                </div>
              )}
              {data.personalInfo?.contact?.location && (
                <div style={{ fontSize: '7.5pt', color: '#cbd5e1', wordBreak: 'break-word' }}>
                  {data.personalInfo.contact.location}
                </div>
              )}
              {data.personalInfo?.contact?.linkedin && (
                <div style={{ fontSize: '7.5pt', color: '#cbd5e1', wordBreak: 'break-word' }}>
                  {data.personalInfo.contact.linkedin}
                </div>
              )}
              {data.personalInfo?.contact?.website && (
                <div style={{ fontSize: '7.5pt', color: '#cbd5e1', wordBreak: 'break-word' }}>
                  {data.personalInfo.contact.website}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <div>
            <div style={{
              fontSize: 'var(--font-size-heading, 8pt)',
              fontFamily: "var(--font-family-heading, 'Inter'), sans-serif",
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              color: accentColor,
              marginBottom: 'var(--spacing-section-heading, 6px)'
            }}>
              Skills
            </div>
              <div style={{
                display: data.settings?.skillsLayout === 'two-column' ? 'grid' : 'flex',
                gridTemplateColumns: data.settings?.skillsLayout === 'two-column' ? '1fr 1fr' : undefined,
                columnGap: data.settings?.skillsLayout === 'two-column' ? '32px' : undefined,
                flexDirection: data.settings?.skillsLayout === 'inline-wrap' ? 'row' : 'column',
                flexWrap: data.settings?.skillsLayout === 'inline-wrap' ? 'wrap' : undefined,
                gap: data.settings?.skillsLayout === 'two-column' ? undefined : `${data.settings?.spacingSkillsRow ?? 8}px`,
                rowGap: data.settings?.skillsLayout === 'two-column' ? `${data.settings?.spacingSkillsRow ?? 8}px` : undefined,
              }}>
                {data.skills.map((skillGroup) => {
                  const isBlock = data.settings?.skillsLayout === 'block';
                  if (isBlock) {
                    return (
                      <div key={skillGroup.id} style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '4px',
                        alignItems: 'flex-start'
                      }}>
                        <div style={{
                          fontSize: '8pt',
                          fontWeight: 600,
                          color: '#f1f5f9',
                          whiteSpace: 'nowrap'
                        }}>{skillGroup.category}:</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: `${data.settings?.spacingSkillsItem ?? 8}px`, rowGap: '2px' }}>
                          {skillGroup.skills.map((skill, index) => (
                            <span key={index} style={{ fontSize: '7pt', color: '#94a3b8', lineHeight: '1.5' }}>
                              {skill}{index < skillGroup.skills.length - 1 ? (data.settings?.skillsSeparator || ' • ') : ''}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div key={skillGroup.id} style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        alignItems: 'baseline',
                        columnGap: `${data.settings?.spacingSkillsItem ?? 8}px`,
                        rowGap: '2px'
                      }}>
                        <div style={{
                          fontSize: '8pt',
                          fontWeight: 600,
                          color: '#f1f5f9',
                          marginRight: '6px',
                          whiteSpace: 'nowrap'
                        }}>{skillGroup.category}:</div>
                        {skillGroup.skills.map((skill, index) => (
                          <span key={index} style={{ fontSize: '7pt', color: '#94a3b8', lineHeight: '1.5' }}>
                            {skill}{index < skillGroup.skills.length - 1 ? (data.settings?.skillsSeparator || ' • ') : ''}
                          </span>
                        ))}
                      </div>
                    );
                  }
                })}
              </div>
          </div>
        )}

        {/* Languages */}
        {data.languages && data.languages.length > 0 && (
          <div>
            <div style={{
              fontSize: 'var(--font-size-heading, 8pt)',
              fontFamily: "var(--font-family-heading, 'Inter'), sans-serif",
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              color: accentColor,
              marginBottom: 'var(--spacing-section-heading, 6px)'
            }}>
              Languages
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-list-items, 4px)' }}>
              {data.languages.map((lang) => (
                <div key={lang.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '7.5pt'
                }}>
                  <span>{lang.language}</span>
                  <span style={{ color: '#64748b' }}>{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications in sidebar */}
        {data.certificates && data.certificates.length > 0 && (
          <div>
            <div style={{
              fontSize: 'var(--font-size-heading, 8pt)',
              fontFamily: "var(--font-family-heading, 'Inter'), sans-serif",
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              color: accentColor,
              marginBottom: 'var(--spacing-section-heading, 6px)'
            }}>
              Certifications
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-item, 6px)' }}>
              {data.certificates.map((cert) => (
                <div key={cert.id}>
                  <div style={{ fontSize: '7.5pt', fontWeight: 600, color: '#f1f5f9' }}>
                    {cert.name}
                  </div>
                  <div style={{ fontSize: '7pt', color: '#64748b' }}>
                    {cert.issuer}, {cert.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        padding: 'var(--margin-y, 0.4in) var(--margin-x, 0.5in)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-section, 14px)'
      }}>
        {/* Summary */}
        {hasSummaryText(data.summary) && (
          <div>
            <div style={{
              fontSize: '11pt',
              fontWeight: 700,
              color: '#0f172a',
              marginBottom: 'var(--spacing-section-heading, 6px)',
              paddingBottom: '3px',
              borderBottom: `2px solid ${accentColor}`
            }}>
              Profile
            </div>
            <div style={{
              fontSize: '9pt',
              color: '#4b5563',
              lineHeight: '1.5'
            }} dangerouslySetInnerHTML={{ __html: getSummaryContent(data.summary) }} />
          </div>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <div>
            <div style={{
              fontSize: '11pt',
              fontWeight: 700,
              color: '#0f172a',
              marginBottom: 'var(--spacing-section-heading, 6px)',
              paddingBottom: '3px',
              borderBottom: `2px solid ${accentColor}`
            }}>
              Experience
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-item, 12px)' }}>
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '9.5pt', color: '#111827' }}>
                      {exp.title}
                    </div>
                    <div style={{
                      fontSize: '9pt',
                      color: accentColor,
                      fontWeight: 500,
                      marginTop: 'var(--spacing-role-company, 2px)'
                    }}>
                      {exp.company}
                    </div>
                  </div>
                  <div style={{ fontSize: '7.5pt', color: '#6b7280', marginTop: '2px' }}>
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate} {exp.location && `| ${exp.location}`}
                  </div>
                  {exp.description && exp.description.length > 0 && (
                    <ul style={{
                      paddingLeft: '12px',
                      marginTop: 'var(--spacing-role-description, 4px)',
                      marginBottom: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--spacing-list-items, 2px)',
                      listStyleType: 'none'
                    }}>
                      {exp.description.map((desc, i) => (
                        <li key={i} style={{
                          fontSize: '8pt',
                          color: '#4b5563',
                          position: 'relative',
                          paddingLeft: '12px'
                        }}>
                          <span style={{
                            position: 'absolute',
                            left: '0',
                            color: accentColor,
                            fontWeight: 'bold'
                          }}>•</span>
                          {desc}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <div>
            <div style={{
              fontSize: '11pt',
              fontWeight: 700,
              color: '#0f172a',
              marginBottom: 'var(--spacing-section-heading, 6px)',
              paddingBottom: '3px',
              borderBottom: `2px solid ${accentColor}`
            }}>
              Education
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-item, 8px)' }}>
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div style={{ fontWeight: 700, fontSize: '9.5pt', color: '#111827' }}>
                    {edu.degree}
                  </div>
                  <div style={{
                    fontSize: '9pt',
                    color: accentColor,
                    fontWeight: 500,
                    marginTop: 'var(--spacing-role-company, 2px)'
                  }}>
                    {edu.institution}
                  </div>
                  <div style={{ fontSize: '7.5pt', color: '#6b7280' }}>
                    {edu.graduationDate} {edu.gpa && `• GPA: ${edu.gpa}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <div>
            <div style={{
              fontSize: '11pt',
              fontWeight: 700,
              color: '#0f172a',
              marginBottom: 'var(--spacing-section-heading, 6px)',
              paddingBottom: '3px',
              borderBottom: `2px solid ${accentColor}`
            }}>
              Projects
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-item, 10px)' }}>
              {data.projects.map((project) => (
                <div key={project.id}>
                  <div style={{ fontWeight: 700, fontSize: '9.5pt', color: '#111827' }}>
                    {project.name}
                  </div>
                  {project.description && (
                    Array.isArray(project.description) ? (
                      project.description.length > 0 && (
                        <ul style={{
                          paddingLeft: '12px',
                          marginTop: 'var(--spacing-role-description, 4px)',
                          marginBottom: 0,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 'var(--spacing-list-items, 2px)',
                          listStyleType: 'none'
                        }}>
                          {project.description.map((desc, i) => (
                            <li key={i} style={{
                              fontSize: '8pt',
                              color: '#4b5563',
                              position: 'relative',
                              paddingLeft: '12px'
                            }}>
                              <span style={{
                                position: 'absolute',
                                left: '0',
                                color: accentColor,
                                fontWeight: 'bold'
                              }}>•</span>
                              {desc}
                            </li>
                          ))}
                        </ul>
                      )
                    ) : (
                      <div style={{
                        fontSize: '8pt',
                        color: '#4b5563',
                        marginTop: 'var(--spacing-role-description, 4px)'
                      }}>
                        {project.description}
                      </div>
                    )
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <div style={{ fontSize: '7pt', color: accentColor, marginTop: '2px' }}>
                      {project.technologies.join(' • ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Awards */}
        {data.awards && data.awards.length > 0 && (
          <div>
            <div style={{
              fontSize: '11pt',
              fontWeight: 700,
              color: '#0f172a',
              marginBottom: 'var(--spacing-section-heading, 6px)',
              paddingBottom: '3px',
              borderBottom: `2px solid ${accentColor}`
            }}>
              Achievements
            </div>
            <ul style={{
              paddingLeft: '12px',
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-list-items, 2px)',
              listStyleType: 'none'
            }}>
              {data.awards.map((achievement) => (
                <li key={achievement.id} style={{
                  fontSize: '8pt',
                  color: '#4b5563',
                  position: 'relative',
                  paddingLeft: '12px'
                }}>
                  <span style={{
                    position: 'absolute',
                    left: '0',
                    color: accentColor,
                    fontWeight: 'bold'
                  }}>•</span>
                  {achievement.title}
                  {achievement.date && ` (${achievement.date})`}
                  {achievement.description && ` - ${achievement.description}`}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Custom Sections */}
        {data.customSections && data.customSections.length > 0 && (
          <>
            {data.customSections.map((section) => (
              <div key={section.id}>
                <div style={{
                  fontSize: '11pt',
                  fontWeight: 700,
                  color: '#0f172a',
                  marginBottom: 'var(--spacing-section-heading, 6px)',
                  paddingBottom: '3px',
                  borderBottom: `2px solid ${accentColor}`
                }}>
                  {section.title}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-item, 8px)' }}>
                  {section.items.map((item) => (
                    <div key={item.id}>
                      <div style={{ fontWeight: 600, fontSize: '9pt', color: '#111827' }}>
                        {item.title}
                        {item.date && (
                          <span style={{ fontWeight: 400, fontSize: '8pt', color: '#6b7280', marginLeft: '8px' }}>
                            ({item.date})
                          </span>
                        )}
                      </div>
                      {item.subtitle && (
                        <div style={{
                          fontSize: '8pt',
                          color: '#4b5563',
                          marginTop: 'var(--spacing-role-company, 2px)'
                        }}>
                          {item.subtitle}
                        </div>
                      )}
                      {item.description && item.description.length > 0 && (
                        <ul style={{
                          paddingLeft: '12px',
                          marginTop: 'var(--spacing-role-description, 4px)',
                          marginBottom: 0,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 'var(--spacing-list-items, 2px)',
                          listStyleType: 'none'
                        }}>
                          {item.description.map((desc, idx) => (
                            <li key={idx} style={{
                              fontSize: '8pt',
                              color: '#4b5563',
                              position: 'relative',
                              paddingLeft: '12px'
                            }}>
                              <span style={{
                                position: 'absolute',
                                left: '0',
                                color: accentColor,
                                fontWeight: 'bold'
                              }}>•</span>
                              {desc}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default ResumeTemplate9;