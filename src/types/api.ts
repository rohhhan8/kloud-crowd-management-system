/** Shape of error bodies returned by the backend. */
export interface ApiErrorBody {
  message?: string
  /** Observed on POST /api/auth/login 401: { errorMessage: "Invalid credentials" } */
  errorMessage?: string
}
