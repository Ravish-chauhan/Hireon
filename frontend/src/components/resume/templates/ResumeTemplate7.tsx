import { TemplateResumeData } from '@/types/resume';

interface ResumeTemplate7Props {
  data: TemplateResumeData;
}

const ResumeTemplate7 = ({ data }: ResumeTemplate7Props) => {
  return (
    <div className="w-[850px] min-h-[1100px] bg-white overflow-hidden"
      style={{
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        fontSize: '9pt',
        lineHeight: '1.4',
        color: '#1a1a2e',
        padding: 'var(--margin-y, 0.5in) var(--margin-x, 0.6in)',
        boxSizing: 'border-box'
      }}>

      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '12px',
        borderBottom: '2px solid #1e3a5f',
        paddingBottom: '10px'
      }}>
        <div style={{
          fontSize: '18pt',
          fontWeight: 700,
          color: '#1e3a5f',
          marginBottom: '2px',
          letterSpacing: '0.5px'
        }}>
          {data.personalInfo?.name || 'Your Name'}
        </div>

        {data.personalInfo?.title && (
          <div style={{
            fontSize: '10pt',
            color: '#4a5568',
            marginBottom: '6px'
          }}>
            {data.personalInfo.title}
          </div>
        )}

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          fontSize: '8pt',
          color: '#4a5568'
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
      {data.summary && (
        <div>
          <div style={{
            fontSize: '10pt',
            fontWeight: 700,
            color: '#1e3a5f',
            borderBottom: '1px solid #e2e8f0',
            paddingBottom: '3px',
            marginTop: '12px',
            marginBottom: '6px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Professional Summary
          </div>
          <div style={{
            fontSize: '9pt',
            color: '#4a5568',
            lineHeight: '1.5'
          }} dangerouslySetInnerHTML={{ __html: data.summary }} />
        </div>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <div>
          <div style={{
            fontSize: '10pt',
            fontWeight: 700,
            color: '#1e3a5f',
            borderBottom: '1px solid #e2e8f0',
            paddingBottom: '3px',
            marginTop: '12px',
            marginBottom: '6px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Professional Experience
          </div>
          {data.experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: '10px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '3px'
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
                    color: '#4a5568'
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
                  margin: '4px 0'
                }}>
                  {exp.description.map((desc, i) => (
                    <li key={i} style={{
                      marginBottom: '2px',
                      fontSize: '8.5pt',
                      color: '#4a5568',
                      position: 'relative',
                      paddingLeft: '12px',
                      listStyleType: 'none'
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
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <div>
          <div style={{
            fontSize: '10pt',
            fontWeight: 700,
            color: '#1e3a5f',
            borderBottom: '1px solid #e2e8f0',
            paddingBottom: '3px',
            marginTop: '12px',
            marginBottom: '6px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Education
          </div>
          {data.education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: '8px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '3px'
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
                    color: '#4a5568'
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
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <div>
          <div style={{
            fontSize: '10pt',
            fontWeight: 700,
            color: '#1e3a5f',
            borderBottom: '1px solid #e2e8f0',
            paddingBottom: '3px',
            marginTop: '12px',
            marginBottom: '6px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Skills
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '6px'
          }}>
            {data.skills.map((skillGroup) => (
              <div key={skillGroup.id} style={{ marginBottom: '4px' }}>
                <span style={{
                  fontWeight: 600,
                  fontSize: '8.5pt',
                  color: '#1e3a5f'
                }}>
                  {skillGroup.category}:
                </span>
                <span style={{
                  fontSize: '8pt',
                  color: '#4a5568',
                  marginLeft: '4px'
                }}>
                  {skillGroup.skills.join(', ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <div>
          <div style={{
            fontSize: '10pt',
            fontWeight: 700,
            color: '#1e3a5f',
            borderBottom: '1px solid #e2e8f0',
            paddingBottom: '3px',
            marginTop: '12px',
            marginBottom: '6px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Projects
          </div>
          {data.projects.map((project) => (
            <div key={project.id} style={{ marginBottom: '8px' }}>
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
                      margin: '4px 0'
                    }}>
                      {project.description.map((desc, i) => (
                        <li key={i} style={{
                          marginBottom: '2px',
                          fontSize: '8pt',
                          color: '#4a5568',
                          position: 'relative',
                          paddingLeft: '12px',
                          listStyleType: 'none'
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
                    color: '#4a5568'
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
      )}

      {/* Certifications */}
      {data.certificates && data.certificates.length > 0 && (
        <div>
          <div style={{
            fontSize: '10pt',
            fontWeight: 700,
            color: '#1e3a5f',
            borderBottom: '1px solid #e2e8f0',
            paddingBottom: '3px',
            marginTop: '12px',
            marginBottom: '6px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Certifications
          </div>
          {data.certificates.map((cert) => (
            <div key={cert.id} style={{ marginBottom: '4px' }}>
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
      )}

      {/* Awards/Achievements */}
      {data.awards && data.awards.length > 0 && (
        <div>
          <div style={{
            fontSize: '10pt',
            fontWeight: 700,
            color: '#1e3a5f',
            borderBottom: '1px solid #e2e8f0',
            paddingBottom: '3px',
            marginTop: '12px',
            marginBottom: '6px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Achievements
          </div>
          <ul style={{
            paddingLeft: '14px',
            margin: '4px 0'
          }}>
            {data.awards.map((achievement) => (
              <li key={achievement.id} style={{
                marginBottom: '2px',
                fontSize: '8.5pt',
                color: '#4a5568',
                position: 'relative',
                paddingLeft: '12px',
                listStyleType: 'none'
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
            fontSize: '10pt',
            fontWeight: 700,
            color: '#1e3a5f',
            borderBottom: '1px solid #e2e8f0',
            paddingBottom: '3px',
            marginTop: '12px',
            marginBottom: '6px',
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
                fontSize: '10pt',
                fontWeight: 700,
                color: '#1e3a5f',
                borderBottom: '1px solid #e2e8f0',
                paddingBottom: '3px',
                marginTop: '12px',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {section.title}
              </div>
              {section.items.map((item) => (
                <div key={item.id} style={{ marginBottom: '8px' }}>
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
                      color: '#4a5568'
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
                          color: '#4a5568',
                          position: 'relative',
                          paddingLeft: '12px',
                          listStyleType: 'none'
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
          ))}
        </>
      )}
    </div>
  );
};

export default ResumeTemplate7;