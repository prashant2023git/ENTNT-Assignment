import { http, HttpResponse } from 'msw';
import { Jobs } from '../constants/jobs';
import { Candidates } from '../constants/candidate';


// --- In-memory Data Store ---
// YOUR CANDIDATES DATA IS NOW THE SOURCE OF TRUTH FOR THE MOCK API
let candidates = [...Candidates];
let jobs = Jobs.map((job, index) => ({
    ...job,
    // Ensure there is a stable order field for sorting and reordering
    order: typeof job.order === 'number' ? job.order : index + 1,
}));
let assessments = {};

export const handlers = [
    // --- JOBS API ---

    // GET /jobs?search=&status=&page=&pageSize=&sort=
    http.get('/api/jobs', ({ request }) => {
        const url = new URL(request.url);
        const search = url.searchParams.get('search')?.toLowerCase() || '';
        const status = url.searchParams.get('status') || '';
        const page = parseInt(url.searchParams.get('page')) || 1;
        const pageSize = parseInt(url.searchParams.get('pageSize')) || 10;
        const sort = url.searchParams.get('sort') || 'order';

        let filteredJobs = [...jobs];

        // Filter by search term (jobTitle, location, tags)
        if (search) {
            filteredJobs = filteredJobs.filter(job =>
                job.jobTitle.toLowerCase().includes(search) ||
                job.location.toLowerCase().includes(search) ||
                job.jobRoles.some(role => role.toLowerCase().includes(search))
            );
        }

        // Filter by status
        if (status) {
            filteredJobs = filteredJobs.filter(job => job.status.toLowerCase() === status.toLowerCase());
        }

        // Sort by 'order' or 'title'
        if (sort === 'title') {
            filteredJobs.sort((a, b) => a.jobTitle.localeCompare(b.jobTitle));
        } else {
            filteredJobs.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        }

        // Paginate
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const paginatedJobs = filteredJobs.slice(start, end);

        return HttpResponse.json({
            jobs: paginatedJobs,
            total: filteredJobs.length,
            page,
            pageSize,
        });
    }),

    // POST /jobs
    http.post('/api/jobs', async ({ request }) => {
        const newJob = await request.json();
        newJob.jobId = `job-${Date.now()}`;
        newJob.status = newJob.status || 'Active';
        newJob.order = jobs.length + 1;
        jobs.push(newJob);
        return HttpResponse.json(newJob, { status: 201 });
    }),

    // PATCH /jobs/:id
    http.patch('/api/jobs/:id', async ({ request, params }) => {
        const { id } = params;
        const updates = await request.json();
        const jobIndex = jobs.findIndex(job => job.jobId === id);

        if (jobIndex === -1) {
            return new HttpResponse(null, { status: 404 });
        }

        jobs[jobIndex] = { ...jobs[jobIndex], ...updates };
        return HttpResponse.json(jobs[jobIndex]);
    }),

    // PATCH /jobs/:id/reorder
    http.patch('/api/jobs/:id/reorder', async ({ request, params }) => {
        if (Math.random() < 0.2) { // 20% chance of failure
            console.error("MSW: Simulating a 500 server error for reorder.");
            return new HttpResponse("Internal Server Error", { status: 500 });
        }

        const { id } = params;
        const { fromOrder, toOrder } = await request.json();
        
        const jobToMove = jobs.find(j => j.jobId === id);
        if (!jobToMove) return new HttpResponse(null, { status: 404 });

        jobs.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)); // Ensure orders are sequential

        if (fromOrder < toOrder) {
            jobs = jobs.map(job => {
                if (job.order > fromOrder && job.order <= toOrder) {
                    return { ...job, order: job.order - 1 };
                }
                return job;
            });
        } else if (fromOrder > toOrder) {
            jobs = jobs.map(job => {
                if (job.order < fromOrder && job.order >= toOrder) {
                    return { ...job, order: job.order + 1 };
                }
                return job;
            });
        }
        jobToMove.order = toOrder;
        jobs.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        return HttpResponse.json({ success: true });
    }),

    // --- CANDIDATES API ---

    // GET /candidates?search=&stage=&page=
    http.get('/api/candidates', ({ request }) => {
        const url = new URL(request.url);
        const search = url.searchParams.get('search')?.toLowerCase() || '';
        const stage = url.searchParams.get('stage') || '';
        const page = parseInt(url.searchParams.get('page')) || 1;
        const pageSize = 10; // Assuming a fixed page size for candidates

        let filteredCandidates = [...candidates];

        // Filter by search (name, title, location, skills)
        if (search) {
            filteredCandidates = filteredCandidates.filter(c =>
                c.name.toLowerCase().includes(search) ||
                c.title.toLowerCase().includes(search) ||
                c.location.toLowerCase().includes(search) ||
                c.skills.some(skill => skill.toLowerCase().includes(search))
            );
        }

        // Filter by status (stage)
        if (stage) {
            filteredCandidates = filteredCandidates.filter(c => c.status.toLowerCase() === stage.toLowerCase());
        }

        const paginatedCandidates = filteredCandidates.slice((page - 1) * pageSize, page * pageSize);
        
        return HttpResponse.json({
            candidates: paginatedCandidates,
            total: filteredCandidates.length,
        });
    }),

    // GET /candidates/:id
    http.get('/api/candidates/:id', ({ params }) => {
        const id = parseInt(params.id);
        const candidate = candidates.find(c => c.id === id);
        if (!candidate) {
            return new HttpResponse(null, { status: 404 });
        }
        return HttpResponse.json(candidate);
    }),

    // POST /candidates
    http.post('/api/candidates', async ({ request }) => {
        const newCandidate = await request.json();
        const maxId = candidates.reduce((max, c) => (typeof c.id === 'number' ? Math.max(max, c.id) : max), 0);
        newCandidate.id = maxId + 1;
        newCandidate.status = 'applied'; // Default status
        candidates.push(newCandidate);
        return HttpResponse.json(newCandidate, { status: 201 });
    }),

    // PATCH /candidates/:id (stage transitions)
    http.patch('/api/candidates/:id', async ({ request, params }) => {
        const id = parseInt(params.id);

        // 2. Find the candidate with the matching ID
        const candidate = candidates.find(c => c.id === id);

        const { status } = await request.json();
        const candidateIndex = candidates.findIndex(c => c.id === id);

        if (candidateIndex === -1) {
            return new HttpResponse(null, { status: 404 });
        }
        
        candidates[candidateIndex].status = status;
        return HttpResponse.json(candidates[candidateIndex]);
    }),

    // GET /candidates/:id/timeline
    http.get('/api/candidates/:id/timeline', ({ params }) => {
        const id = parseInt(params.id);
        const timeline = candidates.find(c => c.id === id)?.jobApplications.map(app => ({
            date: app.appliedDate,
            event: `Applied for ${app.jobTitle} at ${app.company}. Status: ${app.applicationStatus}`,
        })) || [];
        return HttpResponse.json(timeline);
    }),

    // --- ASSESSMENTS API ---

    // GET /assessments/:jobId
    http.get('/api/assessments/:jobId', ({ params }) => {
        const { jobId } = params;
        const assessment = assessments[jobId];
        if (!assessment) return new HttpResponse(null, { status: 404 });
        return HttpResponse.json(assessment);
    }),

    // GET /assessments (list all)
    http.get('/api/assessments', () => {
        const list = Object.entries(assessments).map(([jobId, questions]) => ({
            jobId,
            questions,
            totalQuestions: Array.isArray(questions) ? questions.length : 0,
        }));
        return HttpResponse.json({ assessments: list });
    }),

    // PUT /assessments/:jobId
    http.put('/api/assessments/:jobId', async ({ request, params }) => {
        const { jobId } = params;
        const updatedAssessment = await request.json();
        assessments[jobId] = updatedAssessment;
        return HttpResponse.json(updatedAssessment);
    }),

    // POST /assessments/:jobId/submit
    http.post('/api/assessments/:jobId/submit', () => {
        return new HttpResponse(null, { status: 200 });
    }),
];