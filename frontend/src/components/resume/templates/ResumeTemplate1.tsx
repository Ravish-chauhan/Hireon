import { TemplateResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Linkedin, Github } from 'lucide-react';

interface ResumeTemplate1Props {
  data: TemplateResumeData;
}

const ResumeTemplate1 = ({ data }: ResumeTemplate1Props) => {
  return (
    <div className="resume-page bg-white" style={{ 
      padding: 'var(--margin-y, 0.6in) var(--margin-x, 0.6in)' 
    }}>
      <header className="pb-4 border-b-2 border-gray-400 mb-6">
        <div className="flex items-center gap-6 mb-3">
          {data.personalInfo?.image && (
            <div className="flex-shrink-0">
              <img
                src={data.personalInfo.image}
                alt={data.personalInfo?.name || 'Profile'}
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
              />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-[32px] font-bold text-gray-900 leading-tight mb-1">
              {data.personalInfo?.name || 'Your Name'}
            </h1>
            <p className="text-[16px] text-blue-600 font-semibold">
              {data.personalInfo?.title || 'Professional Title'}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[12px] text-gray-700">
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
          {data.personalInfo?.contact?.linkedin && (
            <span className="flex items-center gap-2">
              <Linkedin className="w-4 h-4 text-blue-600" /> {data.personalInfo.contact.linkedin}
            </span>
          )}
          {data.personalInfo?.contact?.github && (
            <span className="flex items-center gap-2">
              <Github className="w-4 h-4 text-blue-600" /> {data.personalInfo.contact.github}
            </span>
          )}
        </div>
      </header>

      {data.summary && (
        <section className="mb-6">
          <h2 className="text-[16px] font-bold uppercase tracking-wider text-gray-900 mb-3 border-b-2 border-gray-400 pb-1">
            Professional Summary
          </h2>
          <div className="text-[13px] leading-relaxed text-gray-700" dangerouslySetInnerHTML={{ __html: data.summary }} />
        </section>
      )}

      {data.experience && data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-[16px] font-bold uppercase tracking-wider text-gray-900 mb-3 border-b-2 border-gray-400 pb-1">
            Professional Experience
          </h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-5">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-[15px] font-bold text-gray-900">{exp.title}</h3>
                  <p className="text-[13px] text-blue-600 font-semibold">{exp.company}{exp.location && `, ${exp.location}`}</p>
                </div>
                <p className="text-[12px] text-gray-600 font-medium text-right">{exp.startDate} – {exp.endDate}</p>
              </div>
              {exp.description && exp.description.length > 0 && (
                <ul className="list-disc list-outside ml-4 text-[12px] text-gray-700 leading-relaxed space-y-1">
                  {exp.description.map((desc, i) => (
                    <li key={i}>{desc}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {data.skills && data.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-[16px] font-bold uppercase tracking-wider text-gray-900 mb-3 border-b-2 border-gray-400 pb-1">
            Technical Skills
          </h2>
          {data.skills.map((cat) => (
            <div key={cat.id} className="mb-3">
              <h3 className="text-[13px] font-bold text-gray-900 mb-1">{cat.category}</h3>
              <p className="text-[12px] text-gray-700">{cat.skills.join(' • ')}</p>
            </div>
          ))}
        </section>
      )}

      {data.certificates && data.certificates.length > 0 && (
        <section className="mb-6">
          <h2 className="text-[16px] font-bold uppercase tracking-wider text-gray-900 mb-3 border-b-2 border-gray-400 pb-1">
            Certifications
          </h2>
          {data.certificates.map((cert) => (
            <div key={cert.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="text-[13px] font-bold text-gray-900">{cert.name}</h3>
                <span className="text-[12px] text-gray-600">{cert.date}</span>
              </div>
              <p className="text-[12px] text-gray-600">{cert.issuer}</p>
            </div>
          ))}
        </section>
      )}

      {data.awards && data.awards.length > 0 && (
        <section className="mb-6">
          <h2 className="text-[16px] font-bold uppercase tracking-wider text-gray-900 mb-3 border-b-2 border-gray-400 pb-1">
            Awards & Accomplishments
          </h2>
          {data.awards.map((award) => (
            <div key={award.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="text-[13px] font-bold text-gray-900">{award.title}</h3>
                <span className="text-[12px] text-gray-600">{award.date}</span>
              </div>
              {award.description && (
                <p className="text-[12px] text-gray-700 mt-1">{award.description}</p>
              )}
            </div>
          ))}
        </section>
      )}

      {data.languages && data.languages.length > 0 && (
        <section className="mb-6">
          <h2 className="text-[16px] font-bold uppercase tracking-wider text-gray-900 mb-3 border-b-2 border-gray-400 pb-1">
            Languages
          </h2>
          <div className="space-y-2">
            {data.languages.map((lang) => (
              <div key={lang.id} className="flex justify-between items-center">
                <span className="text-[13px] font-bold text-gray-900">{lang.language}</span>
                <span className="text-[12px] text-gray-600">{lang.proficiency}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.publications && data.publications.length > 0 && (
        <section className="mb-6">
          <h2 className="text-[16px] font-bold uppercase tracking-wider text-gray-900 mb-3 border-b-2 border-gray-400 pb-1">
            Publications
          </h2>
          {data.publications.map((pub) => (
            <div key={pub.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="text-[13px] font-bold text-gray-900">{pub.title}</h3>
                <span className="text-[12px] text-gray-600">{pub.date}</span>
              </div>
              <p className="text-[12px] text-gray-600">{pub.authors}</p>
              <p className="text-[12px] text-gray-600 italic">{pub.journal}</p>
              {pub.url && (
                <p className="text-[11px] text-blue-600">{pub.url}</p>
              )}
            </div>
          ))}
        </section>
      )}

      {data.memberships && data.memberships.length > 0 && (
        <section className="mb-6">
          <h2 className="text-[16px] font-bold uppercase tracking-wider text-gray-900 mb-3 border-b-2 border-gray-400 pb-1">
            Professional Memberships
          </h2>
          {data.memberships.map((mem) => (
            <div key={mem.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="text-[13px] font-bold text-gray-900">{mem.organization}</h3>
                <span className="text-[12px] text-gray-600">{mem.startDate} – {mem.endDate}</span>
              </div>
              {mem.role && (
                <p className="text-[12px] text-gray-600">{mem.role}</p>
              )}
            </div>
          ))}
        </section>
      )}

      {data.volunteer && data.volunteer.length > 0 && (
        <section className="mb-6">
          <h2 className="text-[16px] font-bold uppercase tracking-wider text-gray-900 mb-3 border-b-2 border-gray-400 pb-1">
            Volunteer Experience
          </h2>
          {data.volunteer.map((vol) => (
            <div key={vol.id} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-[14px] font-bold text-gray-900">{vol.role}</h3>
                  <p className="text-[13px] text-blue-600 font-semibold">{vol.organization}</p>
                </div>
                <p className="text-[12px] text-gray-600 text-right">{vol.startDate} – {vol.endDate}</p>
              </div>
              {vol.description && (
                <p className="text-[12px] text-gray-700 mt-2">{vol.description}</p>
              )}
            </div>
          ))}
        </section>
      )}

      {data.education && data.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-[16px] font-bold uppercase tracking-wider text-gray-900 mb-3 border-b-2 border-gray-400 pb-1">
            Education
          </h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="mb-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-[14px] font-bold text-gray-900">{edu.degree}</h3>
                  <p className="text-[13px] text-gray-600 font-medium">{edu.institution}{edu.location && `, ${edu.location}`}</p>
                  {edu.gpa && (
                    <p className="text-[12px] text-gray-500">GPA: {edu.gpa}</p>
                  )}
                </div>
                <p className="text-[12px] text-gray-600">{edu.graduationDate}</p>
              </div>
              {edu.description && edu.description.length > 0 && (
                <ul className="list-disc list-outside ml-4 text-[12px] text-gray-700 leading-relaxed space-y-1">
                  {edu.description.map((desc, i) => (
                    <li key={i}>{desc}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {data.projects && data.projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-[16px] font-bold uppercase tracking-wider text-gray-900 mb-3 border-b-2 border-gray-400 pb-1">
            Projects
          </h2>
          {data.projects.map((proj) => (
            <div key={proj.id} className="mb-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-[14px] font-bold text-gray-900">{proj.name}</h3>
                  {proj.role && (
                    <p className="text-[13px] text-blue-600 font-semibold">{proj.role}</p>
                  )}
                  {proj.link && (
                    <p className="text-[11px] text-blue-600">{proj.link}</p>
                  )}
                </div>
                <p className="text-[12px] text-gray-600 text-right">
                  {proj.startDate && proj.endDate ? `${proj.startDate} – ${proj.endDate}` : proj.date}
                </p>
              </div>
              {proj.description && (
                Array.isArray(proj.description) ? (
                  proj.description.length > 0 && (
                    <ul className="list-disc list-outside ml-4 text-[12px] text-gray-700 leading-relaxed space-y-1">
                      {proj.description.map((desc, i) => (
                        <li key={i}>{desc}</li>
                      ))}
                    </ul>
                  )
                ) : (
                  <p className="text-[12px] text-gray-700 mt-1">{proj.description}</p>
                )
              )}
              {proj.technologies && proj.technologies.length > 0 && (
                <p className="text-[11px] text-blue-500 mt-2 font-medium">{proj.technologies.join(' • ')}</p>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default ResumeTemplate1;
