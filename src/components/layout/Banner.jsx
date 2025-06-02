import "./Banner.css";

const Banner = () => {
  return (
    <div className="banner">
      <div className="banner-container">
        <div className="banner-slide">
          <img
            src="https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/ff/8d/ff8d444f0ee95b8be4e88ed584ae861e.png"
            alt="Banner"
          />
        </div>
        <div className="banner-slide">
          <img
            src="https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/be/14/be1485daef7f9dddba6d0cae6acf9e4b.png"
            alt="Banner"
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;

