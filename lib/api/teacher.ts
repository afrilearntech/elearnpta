import { apiRequest } from './client';

export interface TeacherSubject {
  id: number;
  name: string;
  grade: string;
  status: string;
  description: string;
  thumbnail: string;
  teachers: number[];
  moderation_comment: string;
  objectives: string[];
  created_at: string;
  updated_at: string;
  created_by: number;
  teacher_count: number;
}

export async function getTeacherSubjects(): Promise<TeacherSubject[]> {
  return await apiRequest<TeacherSubject[]>('/api-v1/teacher/subjects/');
}

export interface TeacherLesson {
  id: number;
  subject: number;
  topic: number;
  period: number;
  title: string;
  description: string;
  type: string;
  status: string;
  resource: string;
  thumbnail: string;
  created_by: number;
  moderation_comment: string;
  duration_minutes: number;
  created_at: string;
  updated_at: string;
}

export async function getTeacherLessons(): Promise<TeacherLesson[]> {
  return await apiRequest<TeacherLesson[]>('/api-v1/teacher/lessons/');
}

export interface TeacherLessonAssessment {
  id: number;
  lesson: number;
  type: "QUIZ" | "ASSIGNMENT";
  given_by: number;
  title: string;
  instructions: string;
  marks: number;
  due_at: string;
  status: string;
  moderation_comment: string;
  created_at: string;
  updated_at: string;
}

export async function getTeacherLessonAssessments(): Promise<TeacherLessonAssessment[]> {
  return await apiRequest<TeacherLessonAssessment[]>('/api-v1/teacher/lesson-assessments/');
}

export interface CreateLessonAssessmentRequest {
  lesson: number;
  type: "QUIZ" | "ASSIGNMENT";
  given_by: number;
  title: string;
  instructions: string;
  marks: number;
  due_at: string;
  status: string;
  moderation_comment?: string;
}

export interface CreateLessonAssessmentResponse {
  id: number;
  lesson: number;
  type: "QUIZ" | "ASSIGNMENT";
  given_by: number;
  title: string;
  instructions: string;
  marks: number;
  due_at: string;
  status: string;
  moderation_comment: string;
  created_at: string;
  updated_at: string;
}

export async function createLessonAssessment(payload: CreateLessonAssessmentRequest): Promise<CreateLessonAssessmentResponse> {
  return await apiRequest<CreateLessonAssessmentResponse>('/api-v1/teacher/lesson-assessments/create/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export interface CreateLessonRequest {
  subject: number;
  topic: number;
  period: number;
  title: string;
  description: string;
  type: string;
  status: string;
  resource?: File | string | null;
  thumbnail?: File | string | null;
  moderation_comment?: string | null;
  duration_minutes: number;
}

export interface CreateLessonResponse {
  id: number;
  subject: number;
  topic: number;
  period: number;
  title: string;
  description: string;
  type: string;
  status: string;
  resource: string;
  thumbnail: string;
  created_by: number;
  moderation_comment: string;
  duration_minutes: number;
  created_at: string;
  updated_at: string;
}

export async function createTeacherLesson(payload: CreateLessonRequest): Promise<CreateLessonResponse> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!API_BASE_URL) {
    throw new Error('API base URL is not configured');
  }

  const requiresFormData = payload.resource instanceof File || payload.thumbnail instanceof File;
  
  if (requiresFormData) {
    const formData = new FormData();
    formData.append("subject", payload.subject.toString());
    formData.append("topic", payload.topic.toString());
    formData.append("period", payload.period.toString());
    formData.append("title", payload.title);
    formData.append("description", payload.description);
    formData.append("type", payload.type);
    formData.append("status", payload.status);
    formData.append("duration_minutes", payload.duration_minutes.toString());
    if (payload.moderation_comment !== undefined && payload.moderation_comment !== null) {
      formData.append("moderation_comment", payload.moderation_comment);
    }
    if (payload.resource instanceof File) {
      formData.append("resource", payload.resource);
    } else if (typeof payload.resource === "string") {
      formData.append("resource", payload.resource);
    }
    if (payload.thumbnail instanceof File) {
      formData.append("thumbnail", payload.thumbnail);
    } else if (typeof payload.thumbnail === "string") {
      formData.append("thumbnail", payload.thumbnail);
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const response = await fetch(`${API_BASE_URL}/api-v1/teacher/lessons/create/`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Token ${token}` }),
      },
      body: formData,
    });

    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const errorMessage =
        isJson && data?.message
          ? data.message
          : isJson && data?.error
            ? data.error
            : isJson && data?.detail
              ? data.detail
              : `Request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    return data as CreateLessonResponse;
  }

  return await apiRequest<CreateLessonResponse>('/api-v1/teacher/lessons/create/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export interface SubjectOption {
  id: number;
  name: string;
  grade: string;
}

export interface TopicOption {
  id: number;
  name: string;
  subject: number;
  created_at: string;
  updated_at: string;
}

// Use the same endpoints as content creators
export async function getSubjectsForSelect(): Promise<SubjectOption[]> {
  const subjects = await apiRequest<any[]>('/api-v1/content/subjects/');
  return subjects.map((s) => ({
    id: s.id,
    name: s.name,
    grade: s.grade,
  }));
}

export async function getTopicsForSubject(subjectId: number): Promise<TopicOption[]> {
  if (!subjectId) {
    return [];
  }
  // Use the same endpoint as content creators: /api-v1/topics/?subject=${subjectId}
  return await apiRequest<TopicOption[]>(`/api-v1/topics/?subject=${subjectId}`);
}

export interface CreateSubjectRequest {
  name: string;
  grade: string;
  status: string;
  description: string;
  thumbnail?: File | string | null;
  moderation_comment?: string | null;
  objectives: string;
}

export interface CreateSubjectResponse {
  id: number;
  name: string;
  grade: string;
  status: string;
  description: string;
  thumbnail: string;
  teachers: number[];
  moderation_comment: string;
  objectives: string[];
  created_at: string;
  updated_at: string;
  created_by: number;
  teacher_count: number;
}

export async function createTeacherSubject(payload: CreateSubjectRequest): Promise<CreateSubjectResponse> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!API_BASE_URL) {
    throw new Error('API base URL is not configured');
  }

  const url = `${API_BASE_URL}/api-v1/content/subjects/`;

  if (payload.thumbnail instanceof File) {
    const formData = new FormData();
    formData.append('name', payload.name);
    formData.append('grade', payload.grade);
    formData.append('status', payload.status);
    formData.append('description', payload.description);
    formData.append('thumbnail', payload.thumbnail);
    formData.append('objectives', payload.objectives);
    if (payload.moderation_comment) {
      formData.append('moderation_comment', payload.moderation_comment);
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Token ${token}` }),
      },
      body: formData,
    });

    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const errorMessage =
        isJson && data?.message
          ? data.message
          : isJson && data?.error
            ? data.error
            : isJson && data?.detail
              ? data.detail
              : `Request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    // API returns an array, so we get the first item
    const responseData = Array.isArray(data) ? data[0] : data;
    return responseData as CreateSubjectResponse;
  } else {
    const response = await apiRequest<CreateSubjectResponse | CreateSubjectResponse[]>('/api-v1/content/subjects/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    // API returns an array, so we get the first item
    return Array.isArray(response) ? response[0] : response;
  }
}

