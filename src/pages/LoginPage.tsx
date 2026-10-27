import { BrandLogo } from '@/components/shared/BrandLogo'
import { ASSETS } from '@/config/assets'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useScaledRootFont } from '@/hooks/useScaledRootFont'
import { LoginForm } from '@/features/auth/components/LoginForm'

// Faint network lines over the teal header, as in the design.
const HEADER_PATTERN = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="96" fill="none" stroke="white" stroke-opacity=".12"><path d="M0 70 90 20 170 60 260 10 320 40M90 20 60 96M170 60 150 96M170 60 240 96M260 10 300 96M0 30 90 20"/></svg>',
)}")`

// The design is 1110px wide; larger screens scale everything up proportionally.
const DESIGN_WIDTH = 1110

export default function LoginPage() {
  useDocumentTitle('Sign in')
  useScaledRootFont(DESIGN_WIDTH)

  return (
    <main className="relative flex min-h-screen items-center overflow-hidden bg-neutral-900">
      <img
        src={ASSETS.loginBackground}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 size-full object-cover grayscale"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-black/45" />

      <div className="relative z-10 flex w-full flex-col items-center gap-10 px-6 py-10 lg:flex-row lg:justify-between lg:px-[11.4vw]">
        <h1 className="text-2xl leading-snug font-medium text-white lg:text-[1.45rem]">
          Welcome to the
          <br />
          Crowd Management System
        </h1>

        <div className="w-full max-w-72 overflow-hidden rounded-md bg-white shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
          <div
            className="flex h-[5.375rem] items-center justify-center bg-[#1c5c58]"
            style={{ backgroundImage: HEADER_PATTERN, backgroundSize: 'cover' }}
          >
            <BrandLogo className="h-7" />
          </div>
          <div className="px-4 pt-6 pb-4">
            <LoginForm />
          </div>
        </div>
      </div>
    </main>
  )
}
