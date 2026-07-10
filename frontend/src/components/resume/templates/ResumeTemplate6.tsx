import { TemplateResumeData } from '@/types/resume';

interface ResumeTemplate6Props {
  data: TemplateResumeData;
}

const ResumeTemplate6 = ({ data }: ResumeTemplate6Props) => {
  return (
    <div className="w-[850px] min-h-[1100px] bg-white overflow-hidden"
      style={{
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        fontSize: '10pt',
        lineHeight: '1.5',
        color: '#374151',
        padding: 'var(--margin-y, 12mm) var(--margin-x, 16mm)',
        boxSizing: 'border-box'
      }}>

      {/* Header */}
      <div style={{ marginBottom: '8px' }}>
        <div style={{
          fontSize: '24pt',
          fontWeight: 300,
          color: '#111827',
          letterSpacing: '-1px',
          marginBottom: '1px'
        }}>
          {data.personalInfo?.name || 'Your Name'}
        </div>

        {data.personalInfo?.title && (
          <div style={{
            fontSize: '11pt',
            color: '#6b7280',
            fontWeight: 400,
            letterSpacing: '3px',
            textTransform: 'uppercase'
          }}>
            {data.personalInfo.title}
          </div>
        )}

        <div style={{
          display: 'flex',
          gap: '15px',
          marginTop: '8px',
          fontSize: '9pt',
          color: '#6b7280',
          flexWrap: 'wrap'
        }}>
          {data.personalInfo?.contact?.email && (
            <span>{data.personalInfo.contact.email}</span>
          )}
          {data.personalInfo?.contact?.phone && (
            <span>{data.personalInfo.contact.phone}</span>
          )}
          {data.personalInfo?.contact?.location && (
            <span>{data.personalInfo.contact.location}</span>
          )}
          {data.personalInfo?.contact?.linkedin && (
            <span>{data.personalInfo.contact.linkedin}</span>
          )}
          {data.personalInfo?.contact?.website && (
            <span>{data.personalInfo.contact.website}</span>
          )}
        </div>
      </div>

      <div style={{
        height: '1px',
        backgroundColor: '#e5e7eb',
        margin: '12px 0'
      }} />

      {/* Summary */}
      {data.summary && (
        <>
          <div style={{
            fontSize: '8pt',
            fontWeight: 600,
            color: '#9ca3af',
            textTransform: 'uppercase',
            letterSpacing: '3px',
            marginBottom: '8px'
          }}>
            About
          </div>
          <div style={{
            fontSize: '10pt',
            color: '#4b5563',
            lineHeight: '1.6',
            fontStyle: 'italic',
            marginBottom: '12px'
          }} dangerouslySetInnerHTML={{ __html: data.summary }} />
          <div style={{
            height: '1px',
            backgroundColor: '#e5e7eb',
            margin: '20px 0'
          }} />
        </>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <>
          <div style={{
            fontSize: '8pt',
            fontWeight: 600,
            color: '#9ca3af',
            textTransform: 'uppercase',
            letterSpacing: '3px',
            marginBottom: '15px'
          }}>
            Experience
          </div>
          {data.experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: '12px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: '4px'
              }}>
                <div style={{
                  fontWeight: 600,
                  fontSize: '11pt',
                  color: '#111827'
                }}>
                  {exp.title}
                </div>
                <div style={{
                  fontSize: '8pt',
                  color: '#9ca3af',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                </div>
              </div>
              <div style={{
                fontSize: '10pt',
                color: '#6b7280',
                marginBottom: '8px'
              }}>
                {exp.company}{exp.location && `, ${exp.location}`}
              </div>
              {exp.description && exp.description.length > 0 && (
                <ul style={{
                  paddingLeft: '0',
                  listStyle: 'none',
                  margin: '10px 0 0 0'
                }}>
                  {exp.description.map((desc, idx) => (
                    <li key={idx} style={{
                      marginBottom: '5px',
                      fontSize: '9pt',
                      color: '#4b5563',
                      paddingLeft: '12px',
                      position: 'relative'
                    }}>
                      <span style={{
                        position: 'absolute',
                        left: '0',
                        color: '#d1d5db'
                      }}>—</span>
                      {desc}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          <div style={{
            height: '1px',
            backgroundColor: '#e5e7eb',
            margin: '20px 0'
          }} />
        </>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <>
          <div style={{
            fontSize: '8pt',
            fontWeight: 600,
            color: '#9ca3af',
            textTransform: 'uppercase',
            letterSpacing: '3px',
            marginBottom: '15px'
          }}>
            Education
          </div>
          {data.education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: '15px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: '4px'
              }}>
                <div style={{
                  fontWeight: 600,
                  fontSize: '11pt',
                  color: '#111827'
                }}>
                  {edu.degree}
                </div>
                <div style={{
                  fontSize: '8pt',
                  color: '#9ca3af',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  {edu.graduationDate}
                </div>
              </div>
              <div style={{
                fontSize: '10pt',
                color: '#6b7280'
              }}>
                {edu.institution}
              </div>
              {edu.gpa && (
                <div style={{
                  fontSize: '8pt',
                  color: '#9ca3af'
                }}>
                  GPA: {edu.gpa}
                </div>
              )}
              {edu.honors && (
                <div style={{
                  fontSize: '8pt',
                  color: '#9ca3af',
                  fontStyle: 'italic'
                }}>
                  {edu.honors}
                </div>
              )}
            </div>
          ))}
          <div style={{
            height: '1px',
            backgroundColor: '#e5e7eb',
            margin: '20px 0'
          }} />
        </>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <>
          <div style={{
            fontSize: '8pt',
            fontWeight: 600,
            color: '#9ca3af',
            textTransform: 'uppercase',
            letterSpacing: '3px',
            marginBottom: '15px'
          }}>
            Expertise
          </div>
          {data.skills.map((skillGroup) => (
            <div key={skillGroup.id} style={{ marginBottom: '8px' }}>
              <span style={{
                fontSize: '9pt',
                fontWeight: 600,
                color: '#374151',
                marginRight: '8px'
              }}>
                {skillGroup.category}:
              </span>
              <span style={{
                fontSize: '9pt',
                color: '#4b5563'
              }}>
                {skillGroup.skills.join(', ')}
              </span>
            </div>
          ))}
          <div style={{
            height: '1px',
            backgroundColor: '#e5e7eb',
            margin: '15px 0'
          }} />
        </>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <>
          <div style={{
            fontSize: '8pt',
            fontWeight: 600,
            color: '#9ca3af',
            textTransform: 'uppercase',
            letterSpacing: '3px',
            marginBottom: '15px'
          }}>
            Projects
          </div>
          {data.projects.map((project) => (
            <div key={project.id} style={{ marginBottom: '12px' }}>
              <div style={{
                fontWeight: 600,
                fontSize: '11pt',
                color: '#111827'
              }}>
                {project.name}
              </div>
              {Array.isArray(project.description) ? (
                <ul style={{
                  paddingLeft: '0',
                  listStyle: 'none',
                  margin: '8px 0 0 0'
                }}>
                  {project.description.map((desc, idx) => (
                    <li key={idx} style={{
                      marginBottom: '3px',
                      fontSize: '9pt',
                      color: '#4b5563',
                      paddingLeft: '12px',
                      position: 'relative'
                    }}>
                      <span style={{
                        position: 'absolute',
                        left: '0',
                        color: '#d1d5db'
                      }}>—</span>
                      {desc}
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={{
                  fontSize: '9pt',
                  color: '#4b5563'
                }}>
                  {project.description}
                </div>
              )}
              {project.technologies && project.technologies.length > 0 && (
                <div style={{
                  fontSize: '8pt',
                  color: '#9ca3af',
                  marginTop: '4px'
                }}>
                  {project.technologies.join(' · ')}
                </div>
              )}
            </div>
          ))}
        </>
      )}

      {/* Certifications */}
      {data.certificates && data.certificates.length > 0 && (
        <>
          <div style={{
            fontSize: '8pt',
            fontWeight: 600,
            color: '#9ca3af',
            textTransform: 'uppercase',
            letterSpacing: '3px',
            marginBottom: '15px'
          }}>
            Certifications
          </div>
          {data.certificates.map((cert) => (
            <div key={cert.id} style={{ marginBottom: '8px' }}>
              <div style={{
                fontSize: '9pt',
                fontWeight: 600,
                color: '#374151'
              }}>
                {cert.name}
              </div>
              <div style={{
                fontSize: '8pt',
                color: '#6b7280'
              }}>
                {cert.issuer} · {cert.date}
              </div>
            </div>
          ))}
          <div style={{
            height: '1px',
            backgroundColor: '#e5e7eb',
            margin: '20px 0'
          }} />
        </>
      )}

      {/* Languages */}
      {data.languages && data.languages.length > 0 && (
        <>
          <div style={{
            fontSize: '8pt',
            fontWeight: 600,
            color: '#9ca3af',
            textTransform: 'uppercase',
            letterSpacing: '3px',
            marginBottom: '15px'
          }}>
            Languages
          </div>
          {data.languages.map((lang) => (
            <div key={lang.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '6px'
            }}>
              <span style={{
                fontSize: '9pt',
                color: '#374151'
              }}>
                {lang.language}
              </span>
              <span style={{
                fontSize: '8pt',
                color: '#9ca3af'
              }}>
                {lang.proficiency}
              </span>
            </div>
          ))}
          <div style={{
            height: '1px',
            backgroundColor: '#e5e7eb',
            margin: '20px 0'
          }} />
        </>
      )}

      {/* Awards/Achievements */}
      {data.awards && data.awards.length > 0 && (
        <>
          <div style={{
            height: '1px',
            backgroundColor: '#e5e7eb',
            margin: '20px 0'
          }} />
          <div style={{
            fontSize: '8pt',
            fontWeight: 600,
            color: '#9ca3af',
            textTransform: 'uppercase',
            letterSpacing: '3px',
            marginBottom: '15px'
          }}>
            Achievements
          </div>
          <ul style={{
            paddingLeft: '0',
            listStyle: 'none',
            margin: '10px 0 0 0'
          }}>
            {data.awards.map((achievement) => (
              <li key={achievement.id} style={{
                marginBottom: '5px',
                fontSize: '9pt',
                color: '#4b5563',
                paddingLeft: '12px',
                position: 'relative'
              }}>
                <span style={{
                  position: 'absolute',
                  left: '0',
                  color: '#d1d5db'
                }}>—</span>
                {achievement.title} {achievement.date && `(${achievement.date})`}
                {achievement.description && ` - ${achievement.description}`}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Custom Sections */}
      {data.customSections && data.customSections.length > 0 && (
        <>
          {data.customSections.map((section) => (
            <div key={section.id}>
              <div style={{
                height: '1px',
                backgroundColor: '#e5e7eb',
                margin: '20px 0'
              }} />
              <div style={{
                fontSize: '8pt',
                fontWeight: 600,
                color: '#9ca3af',
                textTransform: 'uppercase',
                letterSpacing: '3px',
                marginBottom: '15px'
              }}>
                {section.title}
              </div>
              {section.items.map((item) => (
                <div key={item.id} style={{ marginBottom: '8px' }}>
                  <div style={{
                    fontSize: '9pt',
                    fontWeight: 600,
                    color: '#374151'
                  }}>
                    {item.title}
                    {item.date && (
                      <span style={{
                        fontSize: '8pt',
                        color: '#9ca3af',
                        fontWeight: 'normal',
                        marginLeft: '8px'
                      }}>
                        ({item.date})
                      </span>
                    )}
                  </div>
                  {item.subtitle && (
                    <div style={{
                      fontSize: '8pt',
                      color: '#6b7280'
                    }}>
                      {item.subtitle}
                    </div>
                  )}
                  {item.description && item.description.length > 0 && (
                    <ul style={{
                      paddingLeft: '0',
                      listStyle: 'none',
                      margin: '5px 0 0 0'
                    }}>
                      {item.description.map((desc, idx) => (
                        <li key={idx} style={{
                          marginBottom: '3px',
                          fontSize: '8pt',
                          color: '#4b5563',
                          paddingLeft: '12px',
                          position: 'relative'
                        }}>
                          <span style={{
                            position: 'absolute',
                            left: '0',
                            color: '#d1d5db'
                          }}>—</span>
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

export default ResumeTemplate6;