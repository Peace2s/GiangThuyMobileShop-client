import './Banner.css'

const Banner = () => {
  return (
    <div className="banner">
      <div className="banner-content">
        <h2>LỘC CUỐI NĂM</h2>
        <h3>Săn hàng to - Rinh quà lớn</h3>
        <h1>TRÚNG 8 XE SH</h1>
        <p>Tặng quà 200 triệu - 2 tháng</p>
        <button className="btn btn-primary">Xem ngay</button>
      </div>
      <div className="banner-image">
        <img src="https://via.placeholder.com/400x200" alt="Banner" />
      </div>
    </div>
  )
}

export default Banner