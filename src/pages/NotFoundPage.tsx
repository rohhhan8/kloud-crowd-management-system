import { Link } from 'react-router'
import { ROUTES } from '@/config/routes'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export default function NotFoundPage() {
  useDocumentTitle('Page not found')
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 p-6 text-center">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-sm text-muted-foreground">The page you are looking for does not exist.</p>
      <Link to={ROUTES.overview} className="text-sm text-primary underline underline-offset-4">
        Back to home
      </Link>
    </main>
  )
}
