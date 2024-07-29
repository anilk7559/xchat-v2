import { Spinner } from 'react-bootstrap';

interface IProps {
  containerStyle?: any;
}

function Loading({
  containerStyle = 'text-center my-3 w-100'
}: IProps) {
  return (
    <div className={containerStyle}>
      <Spinner animation="border" variant="primary" />
    </div>
  );
}

export default Loading;
