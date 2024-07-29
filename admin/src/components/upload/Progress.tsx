type IProps = {
  progress: any
}

function Progress({
  progress
}: IProps) {
  return (
    <div className="ProgressBar">
      <div className="Progress" style={{ width: `${progress}%` }} />
    </div>
  );
}

export default Progress;
