function Container({ as: Tag = "div", className = "", children }) {
  return (
    <Tag
      className={`mx-auto w-full max-w-shell px-6 sm:px-10 md:px-16 lg:px-24 ${className}`}
    >
      {children}
    </Tag>
  );
}

export default Container;
