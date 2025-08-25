
function Container({children}) {
  return (
    <div className="relative w-full flex flex-col  gap-5">
        {children}
    </div>
  )
}

export default Container