interface IProps {
  containerStyle?: any;
  size?: any;
}

function Loader({
  containerStyle = 'text-center',
  size = '40px'
}: IProps) {
  return (
    <div className={containerStyle}>
      <img src="/images/loader.gif" width={size} alt="" />
    </div>
  );
}

export default Loader;
