function Default(props: { maincard: JSX.Element }) {
  const { maincard } = props;
  return (
    <div className="relative flex h-full w-full">
      <video
        src={"/video/auth.webm"}
        className="flex h-full w-full object-cover"
        autoPlay
        loop
        muted
      />
      <div className="absolute inset-0 bg-black opacity-60" />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        {maincard}
      </div>
    </div>
  );
}

export default Default;
