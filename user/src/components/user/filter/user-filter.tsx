import { useTranslationContext } from "context/TranslationContext";

type IProps = {
  onFilter: Function;
  showLocation?: boolean;
}

function UserFilter({ onFilter, showLocation = true }: IProps) {

  const germanPostalCodes = [
    "01000", "01001", "01002", "01003", "01004", "01005", "01006", "01007", "01008", "01009",
    "01010", "01011", "01012", "01013", "01014", "01015", "01016", "01017", "01018", "01019",
    "01020", "01021", "01022", "01023", "01024", "01025", "01026", "01027", "01028", "01029",
    "01030", "01031", "01032", "01033", "01034", "01035", "01036", "01037", "01038", "01039",
    "01040", "01041", "01042", "01043", "01044", "01045", "01046", "01047", "01048", "01049",
    "01050", "01051", "01052", "01053", "01054", "01055", "01056", "01057", "01058", "01059",
    "01060", "01061", "01062", "01063", "01064", "01065", "01066", "01067", "01068", "01069",
    "02070", "02071", "02072", "02073", "02074", "02075", "02076", "02077", "02078", "02079",
  ];
  const {t} = useTranslationContext();



  return (
    <>
      <div className="dropdown mr-2">
        <select className="btn btn-outline-default dropdown-toggle" onChange={(e) => onFilter(e.target.value)}>
          <option value="">{t?.header?.option?.all}</option>
          <option value="male">{t?.header?.option?.male}</option>
          <option value="female">{t?.header?.option?.female}</option>
          <option value="transgender">{t?.header?.option?.transgender}</option>
        </select>
      </div>
      <div className="dropdown mr-2">
        <select className="btn btn-outline-default dropdown-toggle" onChange={(e) => onFilter(e.target.value)}>
          <option value="">{t?.header?.postcode}</option>
          {germanPostalCodes?.map((i) => <option key={i} value={i}>{i.slice(0, 2)}xxxx</option>)}
        </select>
      </div>
      <div className="dropdown mr-2">
        <select className="btn btn-outline-default dropdown-toggle" onChange={(e) => onFilter(e.target.value)}>
          <option value="">{t?.header?.location}</option>
          {showLocation && <option value="location">{t?.header?.all}</option>}
        </select>
      </div>
    </>
  );
}

export default UserFilter;
