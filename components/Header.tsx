export default function Header() {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex items-center justify-center gap-8">
        <a href="/" target="_blank" rel="noreferrer">
          <p className="font-sans text-4xl font-bold">RISEN JOB SEEKER</p>
        </a>
      </div>
      <h1 className="sr-only">
        The fastest way to apply your{" "}
        <span className="font-bold ">Dream Job</span>
      </h1>
      <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
        The fastest way to apply your{" "}
        <span className="font-bold ">Dream Job!</span>
      </p>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  );
}
