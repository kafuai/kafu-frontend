export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">
          Access Denied
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          You do not have permission to access this page.
        </p>
      </div>
    </main>
  );
}