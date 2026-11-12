export function PortalFooter() {
  return (
    <footer className="hidden bg-[#edf3f7] px-4 py-4 text-[12px] text-[#5f6c72] sm:ml-[215px] sm:block sm:px-6 sm:py-0">
      <div className="flex min-h-[60px] w-full flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-7">
        <nav className="flex w-full flex-wrap gap-x-3 gap-y-2 sm:w-auto sm:gap-7">
          <a href="#">Public Consultations</a>
          <a href="#">Environmental Assessment</a>
          <a href="#">Civic Accessibility</a>
        </nav>
        <small className="mt-auto self-end font-mono text-[12px] sm:mt-0 sm:ml-auto sm:self-auto">MUTIARA CONNECT</small>
      </div>
    </footer>
  );
}
