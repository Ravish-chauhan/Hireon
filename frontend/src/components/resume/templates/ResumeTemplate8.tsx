import { TemplateResumeData } from '@/types/resume';

interface ResumeTemplate8Props {
  data: TemplateResumeData;
}

const ResumeTemplate8 = ({ data }: ResumeTemplate8Props) => {
  const primaryColor = "#166534";
  const lightColor = "#dcfce7";

  return (
    <div className="w-[850px] min-h-[1100px] bg-white overflow-hidden"
      style={{
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        fontSize: '9pt',
        lineHeight: '1.4',
        color: '#1f2937',
        boxSizing: 'border-box'
      }}>

      {/* Header Banner */}
      <div style={{
        backgroundColor: primaryColor,
        color: '#ffffff',
        padding: 'var(--margin-y, 0.35in) var(--margin-x, 0.5in)'
      }}>
        <div style={{
          fontSize: '18pt',
          fontWeight: 700,
          marginBottom: '2px'
        }}>
          {data.personalInfo?.name || 'Your Name'}
        </div>
        {data.personalInfo?.title && (
          <div style={{
            fontSize: '10pt',
            opacity: 0.9,
            fontWeight: 400
          }}>
            {data.personalInfo.title}
          </div>
        )}
      </div>

      {/* Contact Bar */}
      <div style={{
        backgroundColor: '#14532d',
        padding: '6px var(--margin-x, 0.5in)',
        display: 'flex',
        justifyContent: 'center',
        gap: '18px',
        fontSize: '8pt',
        color: '#bbf7d0',
        flexWrap: 'wrap'
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

      {/* Main Content */}
      <div style={{ padding: 'var(--margin-y, 0.4in) var(--margin-x, 0.5in)' }}>
        {/* Summary */}
        {data.summary && (
          <div>
            <div style={{
              fontSize: '9pt',
              fontWeight: 700,
              color: primaryColor,
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              marginTop: 0,
              marginBottom: '8px',
              paddingBottom: '3px',
              borderBottom: `2px solid ${lightColor}`
            }}>
              Professional Summary
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
              fontSize: '9pt',
              fontWeight: 700,
              color: primaryColor,
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              marginTop: '14px',
              marginBottom: '8px',
              paddingBottom: '3px',
              borderBottom: `2px solid ${lightColor}`
            }}>
              Work Experience
            </div>
            {data.experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: '12px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}>
                  <div>
                    <div style={{
                      fontWeight: 700,
                      fontSize: '9.5pt',
                      color: '#111827'
                    }}>
                      {exp.title}
                    </div>
                    <div style={{
                      fontSize: '9pt',
                      color: primaryColor,
                      fontWeight: 500
                    }}>
                      {exp.company}
                    </div>
                  </div>
                  <div style={{
                    textAlign: 'right',
                    fontSize: '8pt',
                    color: '#6b7280'
                  }}>
                    <div>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</div>
                    {exp.location && <div>{exp.location}</div>}
                  </div>
                </div>
                {exp.description && exp.description.length > 0 && (
                  <ul style={{
                    paddingLeft: '14px',
                    margin: '4px 0 0 0'
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
                          color: primaryColor,
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

        {/* Two column layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px'
        }}>
          {/* Education */}
          {data.education && data.education.length > 0 && (
            <div>
              <div style={{
                fontSize: '9pt',
                fontWeight: 700,
                color: primaryColor,
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                marginTop: '14px',
                marginBottom: '8px',
                paddingBottom: '3px',
                borderBottom: `2px solid ${lightColor}`
              }}>
                Education
              </div>
              {data.education.map((edu) => (
                <div key={edu.id} style={{
                  marginBottom: '8px',
                  padding: '8px',
                  backgroundColor: '#f9fafb',
                  borderLeft: `2px solid ${primaryColor}`
                }}>
                  <div style={{
                    fontWeight: 700,
                    fontSize: '9.5pt',
                    color: '#111827'
                  }}>
                    {edu.degree}
                  </div>
                  <div style={{
                    fontSize: '9pt',
                    color: primaryColor,
                    fontWeight: 500
                  }}>
                    {edu.institution}
                  </div>
                  <div style={{
                    fontSize: '7pt',
                    color: '#6b7280'
                  }}>
                    {edu.graduationDate} {edu.gpa && `| GPA: ${edu.gpa}`}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {data.skills && data.skills.length > 0 && (
            <div>
              <div style={{
                fontSize: '9pt',
                fontWeight: 700,
                color: primaryColor,
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                marginTop: '14px',
                marginBottom: '8px',
                paddingBottom: '3px',
                borderBottom: `2px solid ${lightColor}`
              }}>
                Technical Skills
              </div>
              {data.skills.map((skillGroup) => (
                <div key={skillGroup.id} style={{ marginBottom: '10px' }}>
                  <div style={{
                    fontWeight: 600,
                    fontSize: '8pt',
                    color: primaryColor,
                    marginBottom: '4px'
                  }}>
                    {skillGroup.category}
                  </div>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '4px'
                  }}>
                    {skillGroup.skills.map((skill, i) => (
                      <span key={i} style={{
                        backgroundColor: lightColor,
                        color: primaryColor,
                        padding: '2px 6px',
                        fontSize: '7pt',
                        borderRadius: '2px'
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <div>
            <div style={{
              fontSize: '9pt',
              fontWeight: 700,
              color: primaryColor,
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              marginTop: '14px',
              marginBottom: '8px',
              paddingBottom: '3px',
              borderBottom: `2px solid ${lightColor}`
            }}>
              Projects
            </div>
            {data.projects.map((project) => (
              <div key={project.id} style={{ marginBottom: '8px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <div style={{
                    width: '5px',
                    height: '5px',
                    backgroundColor: primaryColor,
                    borderRadius: '50%'
                  }} />
                  <span style={{
                    fontWeight: 700,
                    fontSize: '9.5pt',
                    color: '#111827'
                  }}>
                    {project.name}
                  </span>
                </div>
                {project.description && (
                  Array.isArray(project.description) ? (
                    project.description.length > 0 && (
                      <ul style={{
                        paddingLeft: '25px',
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
                              color: primaryColor,
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
                      marginLeft: '11px'
                    }}>
                      {project.description}
                    </div>
                  )
                )}
                {project.technologies && project.technologies.length > 0 && (
                  <div style={{
                    fontSize: '7pt',
                    color: primaryColor,
                    marginTop: '2px',
                    marginLeft: '11px'
                  }}>
                    {project.technologies.join(' | ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {data.certificates && data.certificates.length > 0 && (
          <div>
            <div style={{
              fontSize: '9pt',
              fontWeight: 700,
              color: primaryColor,
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              marginTop: '14px',
              marginBottom: '8px',
              paddingBottom: '3px',
              borderBottom: `2px solid ${lightColor}`
            }}>
              Certifications
            </div>
            {data.certificates.map((cert) => (
              <div key={cert.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '5px'
              }}>
                <div style={{
                  width: '5px',
                  height: '5px',
                  backgroundColor: primaryColor,
                  borderRadius: '50%'
                }} />
                <span style={{ fontSize: '8pt' }}>
                  <strong>{cert.name}</strong> – {cert.issuer}, {cert.date}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Languages & Awards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px'
        }}>
          {data.languages && data.languages.length > 0 && (
            <div>
              <div style={{
                fontSize: '9pt',
                fontWeight: 700,
                color: primaryColor,
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                marginTop: '14px',
                marginBottom: '8px',
                paddingBottom: '3px',
                borderBottom: `2px solid ${lightColor}`
              }}>
                Languages
              </div>
              {data.languages.map((lang) => (
                <div key={lang.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '4px',
                  fontSize: '8pt'
                }}>
                  <span style={{ fontWeight: 500 }}>{lang.language}</span>
                  <span style={{ color: '#6b7280' }}>{lang.proficiency}</span>
                </div>
              ))}
            </div>
          )}

          {data.awards && data.awards.length > 0 && (
            <div>
              <div style={{
                fontSize: '9pt',
                fontWeight: 700,
                color: primaryColor,
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                marginTop: '14px',
                marginBottom: '8px',
                paddingBottom: '3px',
                borderBottom: `2px solid ${lightColor}`
              }}>
                Achievements
              </div>
              <ul style={{
                paddingLeft: '14px',
                margin: '4px 0 0 0'
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
                      color: primaryColor,
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
        </div>

        {/* Custom Sections */}
        {data.customSections && data.customSections.length > 0 && (
          <>
            {data.customSections.map((section) => (
              <div key={section.id}>
                <div style={{
                  fontSize: '9pt',
                  fontWeight: 700,
                  color: primaryColor,
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  marginTop: '14px',
                  marginBottom: '8px',
                  paddingBottom: '3px',
                  borderBottom: `2px solid ${lightColor}`
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
                        paddingLeft: '14px',
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
                              color: primaryColor,
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
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default ResumeTemplate8;