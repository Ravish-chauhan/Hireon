import { TemplateResumeData } from '@/types/resume';

interface ResumeTemplate4Props {
  data: TemplateResumeData;
}

const ResumeTemplate4 = ({ data }: ResumeTemplate4Props) => {
  const primaryColor = "#ea580c";

  const styles = {
    page: {
      width: "8.5in",
      minHeight: "11in",
      padding: "var(--margin-y, 0.4in) var(--margin-x, 0.5in)",
      backgroundColor: "#ffffff",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      fontSize: "9pt",
      lineHeight: "1.4",
      color: "#1f2937",
      boxSizing: "border-box" as const,
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "15px",
      paddingBottom: "12px",
      borderBottom: `2px solid ${primaryColor}`,
    },
    nameBlock: {
      flex: 1,
    },
    name: {
      fontSize: "18pt",
      fontWeight: 700,
      color: "#111827",
      lineHeight: "1.1",
    },
    title: {
      fontSize: "10pt",
      color: primaryColor,
      fontWeight: 500,
      marginTop: "3px",
    },
    contactBlock: {
      textAlign: "right" as const,
      fontSize: "8pt",
      color: "#4b5563",
    },
    contactItem: {
      marginBottom: "2px",
    },
    sectionTitle: {
      fontSize: "10pt",
      fontWeight: 700,
      color: primaryColor,
      marginTop: "12px",
      marginBottom: "8px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    sectionLine: {
      flex: 1,
      height: "1px",
      backgroundColor: "#fed7aa",
    },
    summary: {
      fontSize: "9pt",
      color: "#4b5563",
      lineHeight: "1.5",
      backgroundColor: "#fff7ed",
      padding: "10px",
      borderLeft: `3px solid ${primaryColor}`,
    },
    experienceItem: {
      marginBottom: "12px",
      display: "flex",
      gap: "15px",
    },
    timeline: {
      width: "70px",
      flexShrink: 0,
    },
    dateRange: {
      fontSize: "7.5pt",
      color: "#6b7280",
      fontWeight: 500,
    },
    experienceContent: {
      flex: 1,
    },
    jobTitle: {
      fontWeight: 700,
      fontSize: "9.5pt",
      color: "#111827",
    },
    company: {
      fontSize: "9pt",
      color: primaryColor,
      fontWeight: 500,
    },
    location: {
      fontSize: "8pt",
      color: "#9ca3af",
    },
    bulletList: {
      paddingLeft: "12px",
      margin: "4px 0 0 0",
      listStyleType: "none",
    },
    bulletItem: {
      marginBottom: "2px",
      fontSize: "8pt",
      color: "#4b5563",
      position: "relative" as const,
      paddingLeft: "12px",
    },
    skillsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "10px",
    },
    skillCard: {
      backgroundColor: "#f9fafb",
      padding: "8px 10px",
      borderRadius: "3px",
    },
    skillCategory: {
      fontWeight: 600,
      fontSize: "8pt",
      color: primaryColor,
      marginBottom: "3px",
    },
    skillItems: {
      fontSize: "7.5pt",
      color: "#4b5563",
    },
    educationGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "10px",
    },
    educationCard: {
      padding: "8px",
      border: "1px solid #e5e7eb",
      borderRadius: "3px",
    },
    certGrid: {
      display: "flex",
      flexWrap: "wrap" as const,
      gap: "6px",
    },
    certBadge: {
      backgroundColor: "#fff7ed",
      border: `1px solid ${primaryColor}`,
      padding: "3px 8px",
      borderRadius: "12px",
      fontSize: "7pt",
      color: primaryColor,
    },
  };

  return (
    <div style={styles.page} className="resume-page">
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.nameBlock}>
          <div style={styles.name}>{data.personalInfo?.name || 'Your Name'}</div>
          {data.personalInfo?.title && (
            <div style={styles.title}>{data.personalInfo.title}</div>
          )}
        </div>
        <div style={styles.contactBlock}>
          {data.personalInfo?.contact?.email && (
            <div style={styles.contactItem}>{data.personalInfo.contact.email}</div>
          )}
          {data.personalInfo?.contact?.phone && (
            <div style={styles.contactItem}>{data.personalInfo.contact.phone}</div>
          )}
          {data.personalInfo?.contact?.location && (
            <div style={styles.contactItem}>{data.personalInfo.contact.location}</div>
          )}
          {data.personalInfo?.contact?.linkedin && (
            <div style={styles.contactItem}>{data.personalInfo.contact.linkedin}</div>
          )}
          {data.personalInfo?.contact?.website && (
            <div style={styles.contactItem}>{data.personalInfo.contact.website}</div>
          )}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div style={styles.summary} dangerouslySetInnerHTML={{ __html: data.summary }} />
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <div>
          <div style={styles.sectionTitle}>
            Experience
            <div style={styles.sectionLine} />
          </div>
          {data.experience.map((exp, idx) => (
            <div key={exp.id || idx} style={styles.experienceItem}>
              <div style={styles.timeline}>
                <div style={styles.dateRange}>{exp.startDate}</div>
                <div style={styles.dateRange}>{exp.current ? 'Present' : exp.endDate}</div>
              </div>
              <div style={styles.experienceContent}>
                <div style={styles.jobTitle}>{exp.title}</div>
                <div style={styles.company}>{exp.company}</div>
                {exp.location && <div style={styles.location}>{exp.location}</div>}
                {exp.description && exp.description.length > 0 && (
                  <ul style={styles.bulletList}>
                    {exp.description.map((desc, i) => (
                      <li key={i} style={styles.bulletItem}>
                        <span style={{
                          position: "absolute",
                          left: "0",
                          color: primaryColor,
                          fontWeight: "bold"
                        }}>•</span>
                        {desc}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <div>
          <div style={styles.sectionTitle}>
            Skills
            <div style={styles.sectionLine} />
          </div>
          <div style={styles.skillsGrid}>
            {data.skills.map((skill, idx) => (
              <div key={skill.id || idx} style={styles.skillCard}>
                <div style={styles.skillCategory}>{skill.category}</div>
                <div style={styles.skillItems}>{skill.skills.join(" • ")}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <div>
          <div style={styles.sectionTitle}>
            Education
            <div style={styles.sectionLine} />
          </div>
          <div style={styles.educationGrid}>
            {data.education.map((edu, idx) => (
              <div key={edu.id || idx} style={styles.educationCard}>
                <div style={styles.jobTitle}>{edu.degree}</div>
                <div style={styles.company}>{edu.institution}</div>
                <div style={styles.location}>
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
          <div style={styles.sectionTitle}>
            Projects
            <div style={styles.sectionLine} />
          </div>
          {data.projects.map((project, idx) => (
            <div key={project.id || idx} style={{ marginBottom: "8px" }}>
              <div style={styles.jobTitle}>{project.name}</div>
              {project.description && (
                Array.isArray(project.description) ? (
                  project.description.length > 0 && (
                    <ul style={styles.bulletList}>
                      {project.description.map((desc, i) => (
                        <li key={i} style={styles.bulletItem}>
                          <span style={{
                            position: "absolute",
                            left: "0",
                            color: primaryColor,
                            fontWeight: "bold"
                          }}>•</span>
                          {desc}
                        </li>
                      ))}
                    </ul>
                  )
                ) : (
                  <div style={{ fontSize: "8pt", color: "#4b5563" }}>{project.description}</div>
                )
              )}
              {project.technologies && project.technologies.length > 0 && (
                <div style={{ fontSize: "7pt", color: primaryColor, marginTop: "2px" }}>
                  {project.technologies.join(" • ")}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {data.certificates && data.certificates.length > 0 && (
        <div>
          <div style={styles.sectionTitle}>
            Certifications
            <div style={styles.sectionLine} />
          </div>
          <div style={styles.certGrid}>
            {data.certificates.map((cert, idx) => (
              <div key={cert.id || idx} style={styles.certBadge}>
                {cert.name} • {cert.date}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages & Awards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "10px" }}>
        {data.languages && data.languages.length > 0 && (
          <div>
            <div style={styles.sectionTitle}>
              Languages
              <div style={styles.sectionLine} />
            </div>
            {data.languages.map((lang, idx) => (
              <div key={lang.id || idx} style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ fontSize: "8pt", fontWeight: 500 }}>{lang.language}</span>
                <span style={{ fontSize: "7pt", color: "#6b7280" }}>{lang.proficiency}</span>
              </div>
            ))}
          </div>
        )}
        {data.awards && data.awards.length > 0 && (
          <div>
            <div style={styles.sectionTitle}>
              Achievements
              <div style={styles.sectionLine} />
            </div>
            <ul style={styles.bulletList}>
              {data.awards.map((achievement, idx) => (
                <li key={achievement.id || idx} style={styles.bulletItem}>
                  <span style={{
                    position: "absolute",
                    left: "0",
                    color: primaryColor,
                    fontWeight: "bold"
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
          {data.customSections.map((section, idx) => (
            <div key={section.id || idx}>
              <div style={styles.sectionTitle}>
                {section.title}
                <div style={styles.sectionLine} />
              </div>
              {section.items && section.items.length > 0 ? (
                section.items.map((item, itemIdx) => (
                  <div key={item.id || itemIdx} style={{ marginBottom: "8px" }}>
                    <div style={styles.jobTitle}>{item.title}</div>
                    {item.subtitle && (
                      <div style={{ fontSize: "8pt", color: "#4b5563" }}>{item.subtitle}</div>
                    )}
                    {item.description && item.description.length > 0 && (
                      <ul style={styles.bulletList}>
                        {item.description.map((desc, descIdx) => (
                          <li key={descIdx} style={styles.bulletItem}>
                            <span style={{
                              position: "absolute",
                              left: "0",
                              color: primaryColor,
                              fontWeight: "bold"
                            }}>•</span>
                            {desc}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))
              ) : (
                <div style={{ fontSize: "8pt", color: "#4b5563" }}>No items</div>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default ResumeTemplate4;