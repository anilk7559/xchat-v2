import { Alert } from 'react-bootstrap';

interface IProps {
  content: any;
  customStyle?: any;
}
function DangerAlert({ content, customStyle = {} }: IProps) {
  return (
    <Alert variant="danger" className="mx-3 my-2" style={customStyle}>
      {content}
    </Alert>
  );
}

export default DangerAlert;
