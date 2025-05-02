import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer-custom">
      <div className="footer-main">
        <div className="footer-col info-col">
          <div className="footer-title">CỬA HÀNG GIANG THUY MOBILE</div>
          <div>Địa chỉ: 47 QL1A, TT. Vôi, Lạng Giang, Bắc Giang, Việt Nam</div>
          <div>Hotline: 0128 922 0142</div>
          <div>Email: giangthuy.mobile@gmail.com</div>
          <div style={{marginTop: 8}}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><i className="fa fa-facebook"></i></a>
            <a href="mailto:giangthuy.mobile@gmail.com" style={{marginLeft: 10}}><i className="fa fa-envelope"></i></a>
          </div>
        </div>
        <div className="footer-col map-col">
          <iframe
            title="map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.005019688799!2d106.244123!3d21.338123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135d3e2b2b2b2b2%3A0x1234567890abcdef!2zNDcgUUwxQSwgVFRQLiBWw7RpLCBM4bqhbmcgR2lhbmcsIELhuq9jIEdpYW5nLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1680000000000!5m2!1svi!2s"
            width="220"
            height="120"
            style={{ border: 0, borderRadius: 10 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        <div className="footer-col subscribe-col">
          <div className="footer-title">ĐĂNG KÝ NHẬN THÔNG TIN</div>
          <div className="footer-desc">Nhập họ tên và email, chúng tôi sẽ gửi thông tin khuyến mãi và tin tức mới nhất cho bạn.</div>
          <form className="footer-form">
            <input type="text" placeholder="Họ và tên" className="footer-input" />
            <input type="email" placeholder="Email" className="footer-input" />
            <button type="submit" className="footer-btn">Đăng ký</button>
          </form>
        </div>
      </div>
    </footer>
  )
}

export default Footer