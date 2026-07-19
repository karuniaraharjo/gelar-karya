import { login } from './actions'

export default async function LoginPage(props: { searchParams: Promise<{ error?: string }> }) {
  const searchParams = await props.searchParams
  return (
    <div className="min-h-screen bg-bg-base flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-text-primary">
          Admin Login
        </h2>
        <p className="mt-2 text-center text-sm text-text-secondary">
          KaryaFeed Dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-bg-elevated py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-border-subtle">
          <form className="space-y-6" action={login}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text-primary"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-border-subtle rounded-md shadow-sm placeholder-text-secondary focus:outline-none focus:ring-accent-primary focus:border-accent-primary sm:text-sm bg-bg-base text-text-primary"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-text-primary"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-border-subtle rounded-md shadow-sm placeholder-text-secondary focus:outline-none focus:ring-accent-primary focus:border-accent-primary sm:text-sm bg-bg-base text-text-primary"
                />
              </div>
            </div>

            {searchParams?.error && (
              <div className="text-danger text-sm font-medium">
                {searchParams.error === 'unauthorized' ? 'Akses ditolak: Anda tidak memiliki role Admin.' : searchParams.error}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-primary hover:bg-accent-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary focus:ring-offset-bg-base"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
