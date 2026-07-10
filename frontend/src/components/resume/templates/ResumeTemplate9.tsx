import { TemplateResumeData } from '@/types/resume';

interface ResumeTemplate9Props {
  data: TemplateResumeData;
}

const ResumeTemplate9 = ({ data }: ResumeTemplate9Props) => {
  const accentColor = "#0d9488";

  return (
    <div className="w-[850px] min-h-[1100px] bg-white overflow-hidden flex"
      style={{
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        fontSize: '9pt',
        lineHeight: '1.4',
        color: '#1f2937',
        boxSizing: 'border-box'
      }}>

      {/* Sidebar */}
      <div style={{
        width: '240px',
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        padding: 'var(--margin-y, 0.4in) var(--margin-x, 0.3in)'
      }}>
        <div style={{
          fontSize: '14pt',
          fontWeight: 700,
          marginBottom: '3px',
          color: '#ffffff'
        }}>
          {data.personalInfo?.name || 'Your Name'}
        </div>

        {data.personalInfo?.title && (
          <div style={{
            fontSize: '9pt',
            color: accentColor,
            marginBottom: '15px',
            fontWeight: 500
          }}>
            {data.personalInfo.title}
          </div>
        )}

        {/* Contact */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{
            fontSize: '8pt',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            color: accentColor,
            marginBottom: '6px'
          }}>
            Contact
          </div>
          {data.personalInfo?.contact?.email && (
            <div style={{
              fontSize: '7.5pt',
              marginBottom: '4px',
              color: '#cbd5e1',
              wordBreak: 'break-word'
            }}>
              {data.personalInfo.contact.email}
            </div>
          )}
          {data.personalInfo?.contact?.phone && (
            <div style={{
              fontSize: '7.5pt',
              marginBottom: '4px',
              color: '#cbd5e1',
              wordBreak: 'break-word'
            }}>
              {data.personalInfo.contact.phone}
            </div>
          )}
          {data.personalInfo?.contact?.location && (
            <div style={{
              fontSize: '7.5pt',
              marginBottom: '4px',
              color: '#cbd5e1',
              wordBreak: 'break-word'
            }}>
              {data.personalInfo.contact.location}
            </div>
          )}
          {data.personalInfo?.contact?.linkedin && (
            <div style={{
              fontSize: '7.5pt',
              marginBottom: '4px',
              color: '#cbd5e1',
              wordBreak: 'break-word'
            }}>
              {data.personalInfo.contact.linkedin}
            </div>
          )}
          {data.personalInfo?.contact?.website && (
            <div style={{
              fontSize: '7.5pt',
              marginBottom: '4px',
              color: '#cbd5e1',
              wordBreak: 'break-word'
            }}>
              {data.personalInfo.contact.website}
            </div>
          )}
        </div>

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <div style={{ marginBottom: '14px' }}>
            <div style={{
              fontSize: '8pt',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              color: accentColor,
              marginBottom: '6px'
            }}>
              Skills
            </div>
            {data.skills.map((skillGroup) => (
              <div key={skillGroup.id} style={{ marginBottom: '8px' }}>
                <div style={{
                  fontSize: '8pt',
                  fontWeight: 600,
                  color: '#f1f5f9',
                  marginBottom: '2px'
                }}>
                  {skillGroup.category}
                </div>
                <div style={{
                  fontSize: '7pt',
                  color: '#94a3b8',
                  lineHeight: '1.5'
                }}>
                  {skillGroup.skills.join(' • ')}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Languages */}
        {data.languages && data.languages.length > 0 && (
          <div style={{ marginBottom: '14px' }}>
            <div style={{
              fontSize: '8pt',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              color: accentColor,
              marginBottom: '6px'
            }}>
              Languages
            </div>
            {data.languages.map((lang) => (
              <div key={lang.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '7.5pt',
                marginBottom: '3px'
              }}>
                <span>{lang.language}</span>
                <span style={{ color: '#64748b' }}>{lang.proficiency}</span>
              </div>
            ))}
          </div>
        )}

        {/* Certifications in sidebar */}
        {data.certificates && data.certificates.length > 0 && (
          <div style={{ marginBottom: '14px' }}>
            <div style={{
              fontSize: '8pt',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              color: accentColor,
              marginBottom: '6px'
            }}>
              Certifications
            </div>
            {data.certificates.map((cert) => (
              <div key={cert.id} style={{ marginBottom: '6px' }}>
                <div style={{
                  fontSize: '7.5pt',
                  fontWeight: 600,
                  color: '#f1f5f9'
                }}>
                  {cert.name}
                </div>
                <div style={{
                  fontSize: '7pt',
                  color: '#64748b'
                }}>
                  {cert.issuer}, {cert.date}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        padding: 'var(--margin-y, 0.4in) var(--margin-x, 0.5in)'
      }}>
        {/* Summary */}
        {data.summary && (
          <div>
            <div style={{
              fontSize: '11pt',
              fontWeight: 700,
              color: '#0f172a',
              marginBottom: '8px',
              marginTop: '0',
              paddingBottom: '3px',
              borderBottom: `2px solid ${accentColor}`
            }}>
              Profile
            </div>
            <div style={{
              fontSize: '9pt',
              color: '#4b5563',
              lineHeight: '1.5'
            }} dangerouslySetInnerHTML={{ __html: data.summary }} />
          </div>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <div>
            <div style={{
              fontSize: '11pt',
              fontWeight: 700,
              color: '#0f172a',
              marginBottom: '8px',
              marginTop: '14px',
              paddingBottom: '3px',
              borderBottom: `2px solid ${accentColor}`
            }}>
              Experience
            </div>
            {data.experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: '10px' }}>
                <div style={{ marginBottom: '3px' }}>
                  <div style={{
                    fontWeight: 700,
                    fontSize: '9.5pt',
                    color: '#111827'
                  }}>
                    {exp.title}
                  </div>
                  <div style={{
                    fontSize: '9pt',
                    color: accentColor,
                    fontWeight: 500
                  }}>
                    {exp.company}
                  </div>
                </div>
                <div style={{
                  fontSize: '7.5pt',
                  color: '#6b7280',
                  marginBottom: '4px'
                }}>
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate} | {exp.location}
                </div>
                {exp.description && exp.description.length > 0 && (
                  <ul style={{
                    paddingLeft: '12px',
                    margin: '0'
                  }}>
                    {exp.description.map((desc, i) => (
                      <li key={i} style={{
                        marginBottom: '2px',
                        fontSize: '8pt',
                        color: '#4b5563',
                        position: 'relative',
                        paddingLeft: '12px',
                        listStyleType: 'none'
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
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <div>
            <div style={{
              fontSize: '11pt',
              fontWeight: 700,
              color: '#0f172a',
              marginBottom: '8px',
              marginTop: '14px',
              paddingBottom: '3px',
              borderBottom: `2px solid ${accentColor}`
            }}>
              Education
            </div>
            {data.education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: '8px' }}>
                <div style={{
                  fontWeight: 700,
                  fontSize: '9.5pt',
                  color: '#111827'
                }}>
                  {edu.degree}
                </div>
                <div style={{
                  fontSize: '9pt',
                  color: accentColor,
                  fontWeight: 500
                }}>
                  {edu.institution}
                </div>
                <div style={{
                  fontSize: '7.5pt',
                  color: '#6b7280'
                }}>
                  {edu.graduationDate} {edu.gpa && `• GPA: ${edu.gpa}`}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <div>
            <div style={{
              fontSize: '11pt',
              fontWeight: 700,
              color: '#0f172a',
              marginBottom: '8px',
              marginTop: '14px',
              paddingBottom: '3px',
              borderBottom: `2px solid ${accentColor}`
            }}>
              Projects
            </div>
            {data.projects.map((project) => (
              <div key={project.id} style={{ marginBottom: '8px' }}>
                <div style={{
                  fontWeight: 700,
                  fontSize: '9.5pt',
                  color: '#111827'
                }}>
                  {project.name}
                </div>
                {project.description && (
                  Array.isArray(project.description) ? (
                    project.description.length > 0 && (
                      <ul style={{
                        paddingLeft: '12px',
                        margin: '4px 0'
                      }}>
                        {project.description.map((desc, i) => (
                          <li key={i} style={{
                            marginBottom: '2px',
                            fontSize: '8pt',
                            color: '#4b5563',
                            position: 'relative',
                            paddingLeft: '12px',
                            listStyleType: 'none'
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
                      marginTop: '2px'
                    }}>
                      {project.description}
                    </div>
                  )
                )}
                {project.technologies && project.technologies.length > 0 && (
                  <div style={{
                    fontSize: '7pt',
                    color: accentColor,
                    marginTop: '2px'
                  }}>
                    {project.technologies.join(' • ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Awards/Achievements */}
        {data.awards && data.awards.length > 0 && (
          <div>
            <div style={{
              fontSize: '11pt',
              fontWeight: 700,
              color: '#0f172a',
              marginBottom: '8px',
              marginTop: '14px',
              paddingBottom: '3px',
              borderBottom: `2px solid ${accentColor}`
            }}>
              Achievements
            </div>
            <ul style={{
              paddingLeft: '12px',
              margin: '0'
            }}>
              {data.awards.map((achievement) => (
                <li key={achievement.id} style={{
                  marginBottom: '2px',
                  fontSize: '8pt',
                  color: '#4b5563',
                  position: 'relative',
                  paddingLeft: '12px',
                  listStyleType: 'none'
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
                  marginBottom: '8px',
                  marginTop: '14px',
                  paddingBottom: '3px',
                  borderBottom: `2px solid ${accentColor}`
                }}>
                  {section.title}
                </div>
                {section.items.map((item) => (
                  <div key={item.id} style={{ marginBottom: '8px' }}>
                    <div style={{
                      fontWeight: 600,
                      fontSize: '9pt',
                      color: '#111827'
                    }}>
                      {item.title}
                      {item.date && (
                        <span style={{
                          fontWeight: 400,
                          fontSize: '8pt',
                          color: '#6b7280',
                          marginLeft: '8px'
                        }}>
                          ({item.date})
                        </span>
                      )}
                    </div>
                    {item.subtitle && (
                      <div style={{
                        fontSize: '8pt',
                        color: '#4b5563'
                      }}>
                        {item.subtitle}
                      </div>
                    )}
                    {item.description && item.description.length > 0 && (
                      <ul style={{
                        paddingLeft: '12px',
                        margin: '4px 0'
                      }}>
                        {item.description.map((desc, idx) => (
                          <li key={idx} style={{
                            marginBottom: '2px',
                            fontSize: '8pt',
                            color: '#4b5563',
                            position: 'relative',
                            paddingLeft: '12px',
                            listStyleType: 'none'
                          }}>
                            <span style={{
                              position: 'absolute',
                              left: '0',
                              color: accentColor,
                              fontWeight: 'bold'
                            }}>
                              •
                            </span>
                            {desc}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default ResumeTemplate9;