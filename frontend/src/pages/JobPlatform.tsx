import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  Briefcase, 
  MapPin, 
  Building, 
  Search, 
  RefreshCw, 
  Layers, 
  Calendar, 
  DollarSign, 
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
  ArrowLeft,
  Settings,
  Database,
  Terminal,
  Globe,
  Tag
} from "lucide-react";

// Types definition
interface Company {
  _id: string;
  name: string;
  ats: string;
  slug: string;
  careerUrl?: string;
  website?: string;
  totalJobs: number;
  lastSynced?: string;
}

interface Job {
  _id: string;
  global_id: string;
  company: Company | string;
  title: string;
  description?: string;
  descriptionHtml?: string;
  location?: string;
  remote: boolean;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  salaryPeriod?: string;
  employmentType?: string;
  department?: string;
  applyUrl?: string;
  ats: string;
  postedAt?: string;
}

interface JobPlatformProps {
  view: "search" | "job" | "company";
}

export default function JobPlatform({ view }: JobPlatformProps) {
  const { jobId, companySlug } = useParams();
  const navigate = useNavigate();

  // Search & Filter state
  const [q, setQ] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [remote, setRemote] = useState(false);
  const [ats, setAts] = useState("");
  const [employmentType, setEmploymentType] = useState("");

  const [jobs, setJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [currentJob, setCurrentJob] = useState<Job | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(true);

  // Sync state
  const [syncAts, setSyncAts] = useState("greenhouse");
  const [syncLimit, setSyncLimit] = useState(20);
  const [syncing, setSyncing] = useState(false);
  const [syncLogs, setSyncLogs] = useState<string[]>([]);
  const [showAdminConsole, setShowAdminConsole] = useState(false);

  const getBackendUrl = () => {
    const origin = window.location.origin;
    if (origin.includes('eduniaa.com') || origin.includes('vercel.app')) {
      return 'https://eduniaa.onrender.com';
    }
    return 'http://localhost:5000';
  };

  // Load companies
  const fetchCompanies = async () => {
    try {
      const res = await fetch(getBackendUrl() + "/api/companies");
      if (res.ok) {
        const data = await res.json();
        setCompanies(data);
      }
    } catch (err) {
      console.error("Error loading companies:", err);
    }
  };

  // Run Search
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (q) params.append("q", q);
      if (company) params.append("company", company);
      if (location) params.append("location", location);
      if (remote) params.append("remote", "true");
      if (ats) params.append("ats", ats);
      if (employmentType) params.append("employmentType", employmentType);

      const res = await fetch(getBackendUrl() + `/api/search?${params.toString()}`);
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setJobs(data);
    } catch (err: any) {
      setError(err.message || "Failed to search jobs.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch job details
  const fetchJobDetails = async (id: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(getBackendUrl() + `/api/jobs/${id}`);
      if (!res.ok) throw new Error("Job details not found");
      const data = await res.json();
      setCurrentJob(data);
    } catch (err: any) {
      setError(err.message || "Failed to load job details.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch company details
  const fetchCompanyDetails = async (slug: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(getBackendUrl() + `/api/company/${slug}`);
      if (!res.ok) throw new Error("Company details not found");
      const data = await res.json();
      setCurrentCompany(data.company);
      setJobs(data.jobs);
    } catch (err: any) {
      setError(err.message || "Failed to load company details.");
    } finally {
      setLoading(false);
    }
  };

  // Setup Initial load
  useEffect(() => {
    fetchCompanies();
    if (view === "search") {
      handleSearch();
    }
  }, [view]);

  // Route triggers
  useEffect(() => {
    if (view === "job" && jobId) {
      fetchJobDetails(jobId);
    } else if (view === "company" && companySlug) {
      fetchCompanyDetails(companySlug);
    }
  }, [view, jobId, companySlug]);

  // Admin Import Companies action
  const handleImportCompanies = async () => {
    setSyncing(true);
    setSyncLogs(prev => [...prev, `[INIT] Importing first ${syncLimit} ${syncAts} companies from CSV...`]);
    try {
      const res = await fetch(getBackendUrl() + "/api/admin/import-companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ats: syncAts, limit: syncLimit })
      });
      const data = await res.json();
      if (res.ok) {
        setSyncLogs(prev => [
          ...prev, 
          `[SUCCESS] Imported: ${data.stats.total} total rows.`,
          `  - New inserted: ${data.stats.upsertedCount || 0}`,
          `  - Updated: ${data.stats.modifiedCount || 0}`
        ]);
        fetchCompanies();
      } else {
        throw new Error(data.error || "Failed to import companies.");
      }
    } catch (err: any) {
      setSyncLogs(prev => [...prev, `[ERROR] ${err.message}`]);
    } finally {
      setSyncing(false);
    }
  };

  // Admin Sync Jobs action
  const handleSyncJobs = async () => {
    setSyncing(true);
    setSyncLogs(prev => [...prev, `[INIT] Syncing active jobs for ${syncAts} (limit: ${syncLimit} companies)...`]);
    try {
      const res = await fetch(getBackendUrl() + "/api/admin/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ats: syncAts, limit: syncLimit })
      });
      const data = await res.json();
      if (res.ok) {
        setSyncLogs(prev => [
          ...prev,
          `[SUCCESS] Sync summary:`,
          `  - Companies Processed: ${data.result.companiesProcessed}`,
          `  - Active Jobs Sync'd: ${data.result.jobsUpserted}`,
          `  - Closed Jobs Deactivated: ${data.result.jobsDeactivated}`,
        ]);
        if (data.result.errors?.length > 0) {
          data.result.errors.forEach((e: any) => {
            setSyncLogs(prev => [...prev, `  - [WARN] ${e.company} (${e.slug}): ${e.error}`]);
          });
        }
        if (view === "search") handleSearch();
      } else {
        throw new Error(data.error || "Failed to sync jobs.");
      }
    } catch (err: any) {
      setSyncLogs(prev => [...prev, `[ERROR] ${err.message}`]);
    } finally {
      setSyncing(false);
    }
  };

  // Clear search parameters
  const clearFilters = () => {
    setQ("");
    setCompany("");
    setLocation("");
    setRemote(false);
    setAts("");
    setEmploymentType("");
    setTimeout(() => handleSearch(), 0);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-12">
      {/* Dynamic Glassmorphic Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-lg shadow-lg shadow-indigo-600/30">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <Link to="/jobs" className="text-xl font-bold tracking-tight bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent hover:opacity-90">
              HireOn JobBoard
            </Link>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
              MERN MVP
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowAdminConsole(!showAdminConsole)}
              className={`p-2 rounded-lg border transition-all duration-200 flex items-center gap-2 text-sm font-medium ${
                showAdminConsole 
                  ? "bg-violet-600/25 border-violet-500 text-violet-300"
                  : "border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Admin Console</span>
            </button>
            <Link to="/" className="text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors">
              Return Home
            </Link>
          </div>
        </div>
      </header>

      {/* Admin Sync Console */}
      {showAdminConsole && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
            <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-violet-400 font-semibold">
                <Terminal className="w-5 h-5" />
                <span>Job Board Sync Service (Developer Panel)</span>
              </div>
              <button 
                onClick={() => setSyncLogs([])}
                className="text-xs text-slate-500 hover:text-slate-300"
              >
                Clear Terminal
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Controls */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Select ATS Provider
                  </label>
                  <select
                    value={syncAts}
                    onChange={(e) => setSyncAts(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-violet-500 text-sm font-medium"
                  >
                    <option value="greenhouse">Greenhouse</option>
                    <option value="lever">Lever</option>
                    <option value="ashby">Ashby</option>
                    <option value="all">All (Import Only)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Company Limit (CSV Row Scan)
                  </label>
                  <input
                    type="number"
                    value={syncLimit}
                    onChange={(e) => setSyncLimit(Number(e.target.value))}
                    min="1"
                    max="1000"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-violet-500 text-sm font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleImportCompanies}
                    disabled={syncing}
                    className="w-full py-2.5 px-4 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 hover:bg-slate-800 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Database className="w-4 h-4 text-emerald-400" />
                    <span>Import CSV</span>
                  </button>
                  <button
                    onClick={handleSyncJobs}
                    disabled={syncing}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg text-sm font-semibold shadow-lg shadow-violet-600/20 hover:opacity-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {syncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    <span>Sync Jobs</span>
                  </button>
                </div>
              </div>

              {/* Terminal logs output */}
              <div className="lg:col-span-2 bg-black/50 border border-slate-900 rounded-lg p-4 font-mono text-xs text-emerald-400 h-48 overflow-y-auto space-y-1">
                <div className="text-slate-500">// Terminal outputs appear here. Select "Import CSV" first, then "Sync Jobs".</div>
                {syncLogs.map((log, i) => (
                  <div key={i} className="whitespace-pre-wrap">{log}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid View */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* VIEW 1: SEARCH PAGE */}
        {view === "search" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filter sidebar */}
            {showFilters && (
              <aside className="lg:col-span-1 bg-slate-950 border border-slate-800/80 rounded-2xl p-6 h-fit space-y-6 shadow-xl">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <h3 className="font-bold text-slate-200 flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-violet-400" />
                    <span>Filters</span>
                  </h3>
                  <button onClick={clearFilters} className="text-xs font-semibold text-slate-500 hover:text-violet-400 transition-colors">
                    Reset All
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Keyword */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Keyword</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Engineer, Developer..."
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        className="w-full bg-slate-900/60 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-violet-500 placeholder-slate-500"
                      />
                      <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                    </div>
                  </div>

                  {/* Company */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Company</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Company name..."
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full bg-slate-900/60 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-violet-500 placeholder-slate-500"
                      />
                      <Building className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Location</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="City, Country..."
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full bg-slate-900/60 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-violet-500 placeholder-slate-500"
                      />
                      <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                    </div>
                  </div>

                  {/* ATS Provider */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">ATS Platform</label>
                    <select
                      value={ats}
                      onChange={(e) => setAts(e.target.value)}
                      className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
                    >
                      <option value="">All Platforms</option>
                      <option value="greenhouse">Greenhouse</option>
                      <option value="lever">Lever</option>
                      <option value="ashby">Ashby</option>
                    </select>
                  </div>

                  {/* Remote Checkbox */}
                  <div className="pt-2">
                    <label className="relative flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={remote}
                        onChange={(e) => setRemote(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:bg-violet-400 peer-checked:bg-violet-650/40 peer-checked:border-violet-500 border border-slate-700"></div>
                      <span className="text-sm font-semibold text-slate-300 group-hover:text-slate-100 transition-colors">
                        Remote Roles Only
                      </span>
                    </label>
                  </div>
                </div>

                <button
                  onClick={() => handleSearch()}
                  className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-violet-600/10 hover:opacity-95 transition-all flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Listings</span>
                </button>
              </aside>
            )}

            {/* Listings grid */}
            <div className={`lg:col-span-${showFilters ? 3 : 4} space-y-6`}>
              <div className="flex justify-between items-center bg-slate-950/40 px-6 py-4 rounded-xl border border-slate-800/60">
                <span className="text-sm text-slate-400">
                  Showing <strong className="text-slate-200">{jobs.length}</strong> active openings
                </span>
                
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="text-xs font-semibold text-indigo-400 hover:underline flex items-center gap-1.5"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
                </button>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <RefreshCw className="w-8 h-8 text-violet-500 animate-spin" />
                  <span className="text-slate-400 text-sm">Querying active database...</span>
                </div>
              ) : error ? (
                <div className="p-6 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl text-center">
                  {error}
                </div>
              ) : jobs.length === 0 ? (
                <div className="p-12 text-center bg-slate-950 border border-slate-800 rounded-2xl">
                  <Briefcase className="w-12 h-12 text-slate-650 mx-auto mb-4" />
                  <h4 className="font-bold text-slate-300 text-lg">No active jobs found</h4>
                  <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
                    Try adjusting your filters, searching for a different keyword, or run a Sync in the Admin Console.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => {
                    const comp = typeof job.company === "object" ? (job.company as Company) : null;
                    return (
                      <div
                        key={job._id}
                        onClick={() => navigate(`/jobs/${job._id}`)}
                        className="bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 transition-all duration-200 cursor-pointer shadow-md hover:shadow-xl hover:shadow-violet-650/5 group flex flex-col md:flex-row md:items-center justify-between gap-6"
                      >
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-2">
                            {job.remote && (
                              <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                                Remote
                              </span>
                            )}
                            <span className="px-2.5 py-0.5 text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-full uppercase tracking-wider">
                              {job.ats}
                            </span>
                          </div>
                          
                          <h4 className="font-bold text-lg text-slate-100 group-hover:text-violet-400 transition-colors">
                            {job.title}
                          </h4>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-400">
                            {comp && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/company/${comp.slug}`);
                                }}
                                className="flex items-center gap-1.5 hover:text-slate-200 hover:underline font-semibold"
                              >
                                <Building className="w-4 h-4 text-indigo-400" />
                                <span>{comp.name}</span>
                              </button>
                            )}
                            {job.location && (
                              <span className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4 text-slate-500" />
                                <span>{job.location}</span>
                              </span>
                            )}
                            {job.department && (
                              <span className="flex items-center gap-1.5">
                                <Tag className="w-4 h-4 text-slate-500" />
                                <span>{job.department}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end md:self-center">
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>
                              {job.postedAt ? new Date(job.postedAt).toLocaleDateString() : "Just now"}
                            </span>
                          </span>
                          <ChevronRight className="w-5 h-5 text-slate-650 group-hover:translate-x-1 group-hover:text-violet-400 transition-all" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: JOB DETAILS PAGE */}
        {view === "job" && currentJob && (
          <div className="max-w-4xl mx-auto space-y-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-slate-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Listings</span>
            </button>

            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 rounded-full blur-3xl pointer-events-none"></div>
              
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-850">
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {currentJob.remote && (
                      <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                        Remote
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full uppercase tracking-wider">
                      {currentJob.ats}
                    </span>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100">
                    {currentJob.title}
                  </h2>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-400">
                    {typeof currentJob.company === "object" && (
                      <button
                        onClick={() => navigate(`/company/${(currentJob.company as Company).slug}`)}
                        className="flex items-center gap-1.5 hover:text-slate-200 hover:underline font-bold"
                      >
                        <Building className="w-4 h-4 text-indigo-400" />
                        <span>{(currentJob.company as Company).name}</span>
                      </button>
                    )}
                    {currentJob.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-slate-500" />
                        <span>{currentJob.location}</span>
                      </span>
                    )}
                    {currentJob.department && (
                      <span className="flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-slate-500" />
                        <span>{currentJob.department}</span>
                      </span>
                    )}
                  </div>
                </div>

                {currentJob.applyUrl && (
                  <a
                    href={currentJob.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-6 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-violet-600/20 hover:opacity-95 transition-all flex items-center gap-2 text-sm"
                  >
                    <span>Apply on Careers Board</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* Description Body */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-200 border-l-4 border-violet-500 pl-3">
                  Job Description
                </h3>

                {currentJob.descriptionHtml ? (
                  /* Render enriched HTML description inside styled block */
                  <div 
                    className="prose prose-invert max-w-none text-slate-350 text-sm leading-relaxed space-y-4 bg-slate-900/30 p-6 rounded-2xl border border-slate-850/50"
                    dangerouslySetInnerHTML={{ __html: currentJob.descriptionHtml }}
                  />
                ) : currentJob.description ? (
                  /* Fallback plain text description */
                  <div className="text-slate-350 text-sm leading-relaxed whitespace-pre-wrap bg-slate-900/30 p-6 rounded-2xl border border-slate-850/50">
                    {currentJob.description}
                  </div>
                ) : (
                  <div className="text-slate-500 italic text-sm text-center py-6">
                    No description available for this role.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: COMPANY DETAILS VIEW */}
        {view === "company" && currentCompany && (
          <div className="space-y-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-slate-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Listings</span>
            </button>

            {/* Company Info Panel */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-650/5 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="space-y-3">
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-full uppercase tracking-wider">
                  ATS: {currentCompany.ats}
                </span>

                <h2 className="text-3xl font-extrabold text-slate-100">{currentCompany.name}</h2>
                
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-400">
                  {currentCompany.careerUrl && (
                    <a 
                      href={currentCompany.careerUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-1.5 hover:text-slate-200 hover:underline"
                    >
                      <Globe className="w-4 h-4 text-slate-500" />
                      <span>Careers Board</span>
                    </a>
                  )}
                  {currentCompany.lastSynced && (
                    <span className="text-slate-500">
                      Last synchronized: {new Date(currentCompany.lastSynced).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 text-center">
                <span className="block text-2xl font-extrabold text-violet-400">{jobs.length}</span>
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Active Openings</span>
              </div>
            </div>

            {/* Company Active Listings */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-200 pl-1">
                Active Listings at {currentCompany.name}
              </h3>
              
              {jobs.length === 0 ? (
                <div className="p-8 text-center bg-slate-950 border border-slate-800 rounded-2xl text-slate-550 italic text-sm">
                  No active job listings are currently synced for this company. Click sync in the admin console to update.
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div
                      key={job._id}
                      onClick={() => navigate(`/jobs/${job._id}`)}
                      className="bg-slate-950 hover:bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all duration-200 cursor-pointer flex items-center justify-between gap-6 group"
                    >
                      <div className="space-y-2">
                        <h4 className="font-bold text-lg text-slate-100 group-hover:text-violet-400 transition-colors">
                          {job.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-400">
                          {job.location && (
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-4 h-4 text-slate-500" />
                              <span>{job.location}</span>
                            </span>
                          )}
                          {job.department && (
                            <span className="flex items-center gap-1.5">
                              <Tag className="w-4 h-4 text-slate-500" />
                              <span>{job.department}</span>
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-650 group-hover:translate-x-1 group-hover:text-violet-400 transition-all" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
