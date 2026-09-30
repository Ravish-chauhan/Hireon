import { TemplateResumeData } from '@/types/resume';
import { hasSummaryText, getSummaryContent } from './index';

interface ResumeTemplate7Props {
  data: TemplateResumeData;
}

const ResumeTemplate7 = ({ data }: ResumeTemplate7Props) => {
  const align = data.settings?.headerAlignment || 'left';
  return (
    <div className="resume-page w-[850px] min-h-[1100px] bg-white overflow-hidden"
      style={{
        fontFamily: "var(--font-family-body, 'Inter'), sans-serif",
        fontSize: 'var(--font-size-body, 9pt)',
        lineHeight: 'var(--line-spacing, 1.4)',
        color: '#1a1a2e',
        padding: 'var(--margin-y, 0.5in) var(--margin-x, 0.6in)',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-section, 16px)'
      }}>

      {/* Header */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: align === 'center' ? 'center' : (align === 'right' ? 'flex-end' : 'flex-start'),
        textAlign: align as any,
        borderBottom: '2px solid #1e3a5f',
        paddingBottom: '10px',
        gap: 'var(--spacing-title-contact, 8px)',
        width: '100%'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: align === 'center' ? 'center' : (align === 'right' ? 'flex-end' : 'flex-start'),
          gap: 'var(--spacing-name-title, 6px)'
        }}>
          <div style={{
            fontSize: 'var(--font-size-name, 18pt)',
            fontFamily: "var(--font-family-name, 'Inter'), sans-serif",
            fontWeight: 700,
            color: '#1e3a5f',
            letterSpacing: '0.5px',
            margin: 0,
            textAlign: align as any
          }}>
            {data.personalInfo?.name || 'Your Name'}
          </div>

          {data.personalInfo?.title && (
            <div style={{
              fontSize: 'var(--font-size-heading, 10pt)',
              fontFamily: "var(--font-family-heading, 'Inter'), sans-serif",
              color: '#4a5568',
              margin: 0,
              textAlign: align as any
            }}>
              {data.personalInfo.title}
            </div>
          )}
        </div>

        <div style={{
          display: 'flex',
          justifyContent: align === 'center' ? 'center' : (align === 'right' ? 'flex-end' : 'flex-start'),
          flexWrap: 'wrap',
          gap: '10px',
          fontSize: '8pt',
          color: '#4a5568',
          width: '100%'
        }}>
          {data.personalInfo?.contact?.email && (
            <span>{data.personalInfo.contact.email}</span>
          )}
          {data.personalInfo?.contact?.phone && (
            <>
              <span>•</span>
              <span>{data.personalInfo.contact.phone}</span>
            </>
          )}
          {data.personalInfo?.contact?.location && (
            <>
              <span>•</span>
              <span>{data.personalInfo.contact.location}</span>
            </>
          )}
          {data.personalInfo?.contact?.linkedin && (
            <>
              <span>•</span>
              <span>{data.personalInfo.contact.linkedin}</span>
            </>
          )}
          {data.personalInfo?.contact?.website && (
            <>
              <span>•</span>
              <span>{data.personalInfo.contact.website}</span>
            </>
          )}
        </div>
      </div>

      {/* Summary */}
      {hasSummaryText(data.summary) && (
        <div>
          <div style={{
            fontSize: 'var(--font-size-heading, 10pt)',
            fontFamily: "var(--font-family-heading, 'Inter'), sans-serif",
            textAlign: 'var(--align-heading, left)' as any,
            fontWeight: 700,
            color: '#1e3a5f',
            borderBottom: '1px solid #e2e8f0',
            paddingBottom: '3px',
            marginBottom: 'var(--spacing-section-heading, 6px)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Professional Summary
          </div>
          <div style={{
            fontSize: '9pt',
            color: '#4a5568',
            lineHeight: '1.5'
          }} dangerouslySetInnerHTML={{ __html: getSummaryContent(data.summary) }} />
        </div>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <div>
          <div style={{
            fontSize: 'var(--font-size-heading, 10pt)',
            fontFamily: "var(--font-family-heading, 'Inter'), sans-serif",
            textAlign: 'var(--align-heading, left)' as any,
            fontWeight: 700,
            color: '#1e3a5f',
            borderBottom: '1px solid #e2e8f0',
            paddingBottom: '3px',
            marginBottom: 'var(--spacing-section-heading, 6px)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Professional Experience
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-item, 12px)' }}>
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}>
                  <div>
                    <div style={{
                      fontWeight: 600,
                      fontSize: '9.5pt',
                      color: '#1a1a2e'
                    }}>
                      {exp.title}
                    </div>
                    <div style={{
                      fontSize: '9pt',
                      color: '#4a5568',
                      marginTop: 'var(--spacing-role-company, 2px)'
                    }}>
                      {exp.company}
                    </div>
                  </div>
                  <div style={{
                    fontSize: '8pt',
                    color: '#718096',
                    textAlign: 'right'
                  }}>
                    <div>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</div>
                    {exp.location && <div>{exp.location}</div>}
                  </div>
                </div>
                {exp.description && exp.description.length > 0 && (
                  <ul style={{
                    paddingLeft: '14px',
                    marginTop: 'var(--spacing-role-description, 4px)',
                    marginBottom: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--spacing-list-items, 2px)',
                    listStyleType: 'none'
                  }}>
                    {exp.description.map((desc, i) => (
                      <li key={i} style={{
                        fontSize: '8.5pt',
                        color: '#4a5568',
                        position: 'relative',
                        paddingLeft: '12px'
                      }}>
                        <span style={{
                          position: 'absolute',
                          left: '0',
                          color: '#1e3a5f',
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
            fontSize: 'var(--font-size-heading, 10pt)',
            fontFamily: "var(--font-family-heading, 'Inter'), sans-serif",
            textAlign: 'var(--align-heading, left)' as any,
            fontWeight: 700,
            color: '#1e3a5f',
            borderBottom: '1px solid #e2e8f0',
            paddingBottom: '3px',
            marginBottom: 'var(--spacing-section-heading, 6px)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Education
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-item, 12px)' }}>
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}>
                  <div>
                    <div style={{
                      fontWeight: 600,
                      fontSize: '9.5pt',
                      color: '#1a1a2e'
                    }}>
                      {edu.degree}
                    </div>
                    <div style={{
                      fontSize: '9pt',
                      color: '#4a5568',
                      marginTop: 'var(--spacing-role-company, 2px)'
                    }}>
                      {edu.institution}
                    </div>
                  </div>
                  <div style={{
                    fontSize: '8pt',
                    color: '#718096',
                    textAlign: 'right'
                  }}>
                    <div>{edu.graduationDate}</div>
                    {edu.gpa && <div>GPA: {edu.gpa}</div>}
                  </div>
                </div>
                {edu.description && edu.description.length > 0 && (
                  <ul style={{
                    paddingLeft: '14px',
                    marginTop: 'var(--spacing-role-description, 4px)',
                    marginBottom: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--spacing-list-items, 2px)',
                    listStyleType: 'none'
                  }}>
                    {edu.description.map((desc, i) => (
                      <li key={i} style={{
                        fontSize: '8.5pt',
                        color: '#4a5568',
                        position: 'relative',
                        paddingLeft: '12px'
                      }}>
                        <span style={{
                          position: 'absolute',
                          left: '0',
                          color: '#1e3a5f',
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

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <div>
          <div style={{
            fontSize: 'var(--font-size-heading, 10pt)',
            fontFamily: "var(--font-family-heading, 'Inter'), sans-serif",
            textAlign: 'var(--align-heading, left)' as any,
            fontWeight: 700,
            color: '#1e3a5f',
            borderBottom: '1px solid #e2e8f0',
            paddingBottom: '3px',
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
                      <span style={{
                        fontWeight: 600,
                        fontSize: '8.5pt',
                        color: '#1e3a5f',
                        whiteSpace: 'nowrap'
                      }}>{skillGroup.category}:</span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: `${data.settings?.spacingSkillsItem ?? 8}px`, rowGap: '2px' }} className="text-[length:calc(var(--font-size-body)*1.000)] font-[family-name:var(--font-family-body)] text-gray-700">
                        {skillGroup.skills.map((skill, index) => (
                          <span key={index} style={{ fontSize: '8pt', color: '#4a5568' }}>
                            {skill}{index < skillGroup.skills.length - 1 ? (data.settings?.skillsSeparator || ', ') : ''}
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
                      <span style={{
                        fontWeight: 600,
                        fontSize: '8.5pt',
                        color: '#1e3a5f',
                        marginRight: '6px',
                        whiteSpace: 'nowrap'
                      }}>{skillGroup.category}:</span>
                      {skillGroup.skills.map((skill, index) => (
                        <span key={index} style={{ fontSize: '8pt', color: '#4a5568' }}>
                          {skill}{index < skillGroup.skills.length - 1 ? (data.settings?.skillsSeparator || ', ') : ''}
                        </span>
                      ))}
                    </div>
                  );
                }
              })}
            </div>
        </div>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <div>
          <div style={{
            fontSize: 'var(--font-size-heading, 10pt)',
            fontFamily: "var(--font-family-heading, 'Inter'), sans-serif",
            textAlign: 'var(--align-heading, left)' as any,
            fontWeight: 700,
            color: '#1e3a5f',
            borderBottom: '1px solid #e2e8f0',
            paddingBottom: '3px',
            marginBottom: 'var(--spacing-section-heading, 6px)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Projects
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-item, 12px)' }}>
            {data.projects.map((project) => (
              <div key={project.id}>
                <div style={{
                  fontWeight: 600,
                  color: '#1e3a5f',
                  fontSize: '9pt'
                }}>
                  {project.name}
                  {project.link && (
                    <span style={{
                      fontWeight: 400,
                      fontSize: '8pt',
                      color: '#718096',
                      marginLeft: '4px'
                    }}>
                      | {project.link}
                    </span>
                  )}
                </div>
                {project.description && (
                  Array.isArray(project.description) ? (
                    project.description.length > 0 && (
                      <ul style={{
                        paddingLeft: '14px',
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
                            color: '#4a5568',
                            position: 'relative',
                            paddingLeft: '12px'
                          }}>
                            <span style={{
                              position: 'absolute',
                              left: '0',
                              color: '#1e3a5f',
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
                      color: '#4a5568',
                      marginTop: 'var(--spacing-role-description, 4px)'
                    }}>
                      {project.description}
                    </div>
                  )
                )}
                {project.technologies && project.technologies.length > 0 && (
                  <div style={{
                    fontSize: '7.5pt',
                    color: '#718096',
                    marginTop: '2px'
                  }}>
                    Tech: {project.technologies.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {data.certificates && data.certificates.length > 0 && (
        <div>
          <div style={{
            fontSize: 'var(--font-size-heading, 10pt)',
            fontFamily: "var(--font-family-heading, 'Inter'), sans-serif",
            textAlign: 'var(--align-heading, left)' as any,
            fontWeight: 700,
            color: '#1e3a5f',
            borderBottom: '1px solid #e2e8f0',
            paddingBottom: '3px',
            marginBottom: 'var(--spacing-section-heading, 6px)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Certifications
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-item, 4px)' }}>
            {data.certificates.map((cert) => (
              <div key={cert.id}>
                <span style={{
                  fontWeight: 600,
                  fontSize: '8.5pt'
                }}>
                  {cert.name}
                </span>
                <span style={{
                  color: '#718096',
                  fontSize: '8pt'
                }}>
                  {' '}– {cert.issuer}, {cert.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Awards/Achievements */}
      {data.awards && data.awards.length > 0 && (
        <div>
          <div style={{
            fontSize: 'var(--font-size-heading, 10pt)',
            fontFamily: "var(--font-family-heading, 'Inter'), sans-serif",
            textAlign: 'var(--align-heading, left)' as any,
            fontWeight: 700,
            color: '#1e3a5f',
            borderBottom: '1px solid #e2e8f0',
            paddingBottom: '3px',
            marginBottom: 'var(--spacing-section-heading, 6px)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Achievements
          </div>
          <ul style={{
            paddingLeft: '14px',
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-list-items, 2px)',
            listStyleType: 'none'
          }}>
            {data.awards.map((achievement) => (
              <li key={achievement.id} style={{
                fontSize: '8.5pt',
                color: '#4a5568',
                position: 'relative',
                paddingLeft: '12px'
              }}>
                <span style={{
                  position: 'absolute',
                  left: '0',
                  color: '#1e3a5f',
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

      {/* Languages */}
      {data.languages && data.languages.length > 0 && (
        <div>
          <div style={{
            fontSize: 'var(--font-size-heading, 10pt)',
            fontFamily: "var(--font-family-heading, 'Inter'), sans-serif",
            textAlign: 'var(--align-heading, left)' as any,
            fontWeight: 700,
            color: '#1e3a5f',
            borderBottom: '1px solid #e2e8f0',
            paddingBottom: '3px',
            marginBottom: 'var(--spacing-section-heading, 6px)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Languages
          </div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '15px'
          }}>
            {data.languages.map((lang) => (
              <span key={lang.id} style={{ fontSize: '8.5pt' }}>
                <span style={{ fontWeight: 600 }}>{lang.language}</span>
                <span style={{ color: '#718096' }}> ({lang.proficiency})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Custom Sections */}
      {data.customSections && data.customSections.length > 0 && (
        <>
          {data.customSections.map((section) => (
            <div key={section.id}>
              <div style={{
                fontSize: 'var(--font-size-heading, 10pt)',
                fontFamily: "var(--font-family-heading, 'Inter'), sans-serif",
                textAlign: 'var(--align-heading, left)' as any,
                fontWeight: 700,
                color: '#1e3a5f',
                borderBottom: '1px solid #e2e8f0',
                paddingBottom: '3px',
                marginBottom: 'var(--spacing-section-heading, 6px)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {section.title}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-item, 8px)' }}>
                {section.items.map((item) => (
                  <div key={item.id}>
                    <div style={{
                      fontWeight: 600,
                      fontSize: '9pt',
                      color: '#1a1a2e'
                    }}>
                      {item.title}
                      {item.date && (
                        <span style={{
                          fontWeight: 400,
                          fontSize: '8pt',
                          color: '#718096',
                          marginLeft: '8px'
                        }}>
                          ({item.date})
                        </span>
                      )}
                    </div>
                    {item.subtitle && (
                      <div style={{
                        fontSize: '8pt',
                        color: '#4a5568',
                        marginTop: 'var(--spacing-role-company, 2px)'
                      }}>
                        {item.subtitle}
                      </div>
                    )}
                    {item.description && item.description.length > 0 && (
                      <ul style={{
                        paddingLeft: '14px',
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
                            color: '#4a5568',
                            position: 'relative',
                            paddingLeft: '12px'
                          }}>
                            <span style={{
                              position: 'absolute',
                              left: '0',
                              color: '#1e3a5f',
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
  );
};

export default ResumeTemplate7;