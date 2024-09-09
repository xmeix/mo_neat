import "./NoData.scss";
const NoData = ({ title, text }) => {
  return (
    <div className="empty-table">
      <div className="table-title">{title}</div>
      <div className="empty-table-text">{text}</div>
    </div>
  );
};

export default NoData;
