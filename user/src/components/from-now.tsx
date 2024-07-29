import moment from 'moment';

type Props = {
  time: string;
};

export function FromNow({
  time
}: Props) {
  if (!time) return null;

  return <span>{moment(time).fromNow()}</span>;
}

export default FromNow;
