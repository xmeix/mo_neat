import "./NoData.scss";
import image from "/media/noData.png";
const NoData = ({ title, text }) => {
  return (
    <div className="empty-table">
      <div className="table-title">{title}</div>
      <div className="empty-table-text">
        <a href="https://www.flaticon.com/free-icons/sad" title="sad icons">
          <img src={image} alt="" className="empty-img" />
        </a>
        {text}
      </div>
    </div>
  );
};

export default NoData;
