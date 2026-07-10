import { TemplateResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Linkedin } from 'lucide-react';

interface ResumeTemplate2Props {
  data: TemplateResumeData;
}

const ResumeTemplate2 = ({ data }: ResumeTemplate2Props) => {
  return (
    <div className="resume-page bg-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-rose-600 to-pink-600 text-white" style={{ padding: 'var(--margin-y, 2rem) var(--margin-x, 2rem)' }}>
        <div className="flex items-center gap-6">
          {data.personalInfo?.image && (
            <div className="flex-shrink-0">
              <img
                src={data.personalInfo.image}
                alt={data.personalInfo?.name || 'Profile'}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-[32px] font-bold leading-tight mb-2">
              {data.personalInfo?.name || 'Your Name'}
            </h1>
            <p className="text-[18px] text-rose-100 font-medium">
              {data.personalInfo?.title || 'Professional Title'}
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          {data.personalInfo?.contact?.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-rose-200" />
              <span className="text-[13px]">{data.personalInfo.contact.email}</span>
            </div>
          )}
          {data.personalInfo?.contact?.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-rose-200" />
              <span className="text-[13px]">{data.personalInfo.contact.phone}</span>
            </div>
          )}
          {data.personalInfo?.contact?.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-200" />
              <span className="text-[13px]">{data.personalInfo.contact.location}</span>
            </div>
          )}
          {data.personalInfo?.contact?.linkedin && (
            <div className="flex items-center gap-2">
              <Linkedin className="w-4 h-4 text-rose-200" />
              <span className="text-[13px]">{data.personalInfo.contact.linkedin}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1" style={{ padding: 'var(--margin-y, 2rem) var(--margin-x, 2rem)' }}>

          {data.summary && (
            <section className="mb-6">
              <h2 className="text-[18px] font-bold uppercase tracking-wider text-gray-800 mb-3 flex items-center gap-3">
                <span className="w-12 h-1 bg-rose-500 rounded"></span> Professional Summary
              </h2>
              <div className="text-[13px] leading-relaxed text-gray-700" dangerouslySetInnerHTML={{ __html: data.summary }} />
            </section>
          )}

          {data.experience && (
            <section className="mb-6">
              <h2 className="text-[18px] font-bold uppercase tracking-wider text-gray-800 mb-3 flex items-center gap-3">
                <span className="w-12 h-1 bg-rose-500 rounded"></span> Professional Experience
              </h2>
              {data.experience.map((exp) => (
                <div key={exp.id} className="mb-5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-[15px] font-bold text-gray-900">{exp.title}</h3>
                      <p className="text-[13px] text-rose-600 font-medium">{exp.company}{exp.location && `, ${exp.location}`}</p>
                    </div>
                    <p className="text-[12px] text-gray-500 font-medium">{exp.startDate} – {exp.endDate}</p>
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

          {data.projects && (
            <section className="mb-6">
              <h2 className="text-[18px] font-bold uppercase tracking-wider text-gray-800 mb-3 flex items-center gap-3">
                <span className="w-12 h-1 bg-rose-500 rounded"></span> Key Projects
              </h2>
              {data.projects.map((proj) => (
                <div key={proj.id} className="mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-[14px] font-bold text-gray-800">{proj.name}</h3>
                      {proj.role && (
                        <p className="text-[12px] text-rose-600 font-medium">{proj.role}</p>
                      )}
                      {proj.link && (
                        <p className="text-[11px] text-rose-600">{proj.link}</p>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 font-medium">
                      {proj.startDate && proj.endDate ? `${proj.startDate} – ${proj.endDate}` : proj.date}
                    </p>
                  </div>
                  {proj.description && (
                    Array.isArray(proj.description) ? (
                      proj.description.length > 0 && (
                        <ul className="list-disc list-outside ml-4 text-[12px] text-gray-600 leading-relaxed space-y-1">
                          {proj.description.map((desc, i) => (
                            <li key={i}>{desc}</li>
                          ))}
                        </ul>
                      )
                    ) : (
                      <p className="text-[12px] text-gray-600 mt-1">{proj.description}</p>
                    )
                  )}
                  {proj.technologies && proj.technologies.length > 0 && (
                    <p className="text-[11px] text-rose-500 mt-2 font-medium">{proj.technologies.join(' • ')}</p>
                  )}
                </div>
              ))}
            </section>
          )}

          {data.education && (
            <section>
              <h2 className="text-[18px] font-bold uppercase tracking-wider text-gray-800 mb-3 flex items-center gap-3">
                <span className="w-12 h-1 bg-rose-500 rounded"></span> Education
              </h2>
              {data.education.map((edu) => (
                <div key={edu.id} className="mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-[14px] font-bold text-gray-800">{edu.degree}</h3>
                      <p className="text-[12px] text-gray-600 font-medium">{edu.institution}</p>
                      {edu.gpa && (
                        <p className="text-[11px] text-gray-500">GPA: {edu.gpa}</p>
                      )}
                    </div>
                    <p className="text-[12px] text-gray-500 font-medium">{edu.graduationDate}</p>
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
        </div>

        {/* Right Sidebar */}
        <div className="w-[2.5in] bg-rose-50 p-6 min-h-[9in]">

          {data.skills && (
            <div className="mb-6">
              <h2 className="text-[16px] font-bold uppercase tracking-wider text-rose-700 mb-3 border-b-2 border-rose-300 pb-1">Technical Skills</h2>
              {data.skills.map((cat) => (
                <div key={cat.id} className="mb-4">
                  <h3 className="text-[13px] font-semibold text-gray-800 mb-2">{cat.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {cat.skills.map((skill, i) => (
                      <span key={i} className="text-[11px] px-2 py-1 bg-white text-gray-700 rounded border border-rose-200 font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {data.certificates && (
            <div className="mb-6">
              <h2 className="text-[16px] font-bold uppercase tracking-wider text-rose-700 mb-3 border-b-2 border-rose-300 pb-1">Certifications</h2>
              {data.certificates.map((cert) => (
                <div key={cert.id} className="mb-3">
                  <p className="text-[12px] font-semibold text-gray-800">{cert.name}</p>
                  <p className="text-[11px] text-gray-600">{cert.issuer}</p>
                  <p className="text-[10px] text-gray-500">{cert.date}</p>
                </div>
              ))}
            </div>
          )}

          {data.awards && data.awards.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[16px] font-bold uppercase tracking-wider text-rose-700 mb-3 border-b-2 border-rose-300 pb-1">Awards</h2>
              {data.awards.map((award) => (
                <div key={award.id} className="mb-3">
                  <p className="text-[12px] font-semibold text-gray-800">{award.title}</p>
                  <p className="text-[10px] text-gray-500">{award.date}</p>
                  {award.description && (
                    <p className="text-[11px] text-gray-600 mt-1">{award.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {data.languages && data.languages.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[16px] font-bold uppercase tracking-wider text-rose-700 mb-3 border-b-2 border-rose-300 pb-1">Languages</h2>
              {data.languages.map((lang) => (
                <div key={lang.id} className="mb-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-semibold text-gray-800">{lang.language}</span>
                    <span className="text-[11px] text-gray-600">{lang.proficiency}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {data.publications && data.publications.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[16px] font-bold uppercase tracking-wider text-rose-700 mb-3 border-b-2 border-rose-300 pb-1">Publications</h2>
              {data.publications.map((pub) => (
                <div key={pub.id} className="mb-3">
                  <p className="text-[12px] font-semibold text-gray-800">{pub.title}</p>
                  <p className="text-[11px] text-gray-600">{pub.authors}</p>
                  <p className="text-[11px] text-gray-600 italic">{pub.journal}</p>
                  <p className="text-[10px] text-gray-500">{pub.date}</p>
                </div>
              ))}
            </div>
          )}

          {data.memberships && data.memberships.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[16px] font-bold uppercase tracking-wider text-rose-700 mb-3 border-b-2 border-rose-300 pb-1">Memberships</h2>
              {data.memberships.map((mem) => (
                <div key={mem.id} className="mb-3">
                  <p className="text-[12px] font-semibold text-gray-800">{mem.organization}</p>
                  {mem.role && <p className="text-[11px] text-gray-600">{mem.role}</p>}
                  <p className="text-[10px] text-gray-500">{mem.startDate} – {mem.endDate}</p>
                </div>
              ))}
            </div>
          )}

          {data.volunteer && data.volunteer.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[16px] font-bold uppercase tracking-wider text-rose-700 mb-3 border-b-2 border-rose-300 pb-1">Volunteer Experience</h2>
              {data.volunteer.map((vol) => (
                <div key={vol.id} className="mb-3">
                  <p className="text-[12px] font-semibold text-gray-800">{vol.role}</p>
                  <p className="text-[11px] text-gray-600">{vol.organization}</p>
                  <p className="text-[10px] text-gray-500">{vol.startDate} – {vol.endDate}</p>
                  {vol.description && (
                    <p className="text-[11px] text-gray-600 mt-1">{vol.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}


        </div>
      </div>
    </div>
  );
};

export default ResumeTemplate2;
