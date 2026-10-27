/** "--" visually, "Still inside" for screen readers. */
export function StillInside() {
  return (
    <>
      <span aria-hidden="true">--</span>
      <span className="sr-only">Still inside</span>
    </>
  )
}
