import './Footer.css'

const Footer = () => {
    return (
      <footer className="footer">
        <div className="footer-content container">
          <div className="footer-sections">
            <div className="footer-section">
              <h3>TIN TỨC</h3>
              <ul>
                <li><a href="#">Giới thiệu</a></li>
                <li><a href="#">Tin khuyến mãi</a></li>
                <li><a href="#">Tin tuyển dụng</a></li>
                <li><a href="#">Quản hệ cổ đông</a></li>
                <li><a href="#">Chính sách bảo mật</a></li>
              </ul>
            </div>
  
            <div className="footer-section">
              <h3>HỖ TRỢ MUA HÀNG</h3>
              <ul>
                <li><a href="#">Hỗ trợ mua hàng trực tuyến</a></li>
                <li><a href="#">Hướng dẫn mua hàng trực tuyến</a></li>
                <li><a href="#">Phương thức thanh toán</a></li>
                <li><a href="#">Phí vận chuyển</a></li>
                <li><a href="#">Chính sách bảo hành</a></li>
              </ul>
            </div>
  
            <div className="footer-section">
              <h3>CHÍNH SÁCH CHUNG</h3>
              <ul>
                <li><a href="#">Chính sách quy định chung</a></li>
                <li><a href="#">Chính sách vận chuyển</a></li>
                <li><a href="#">Chính sách bảo hành</a></li>
                <li><a href="#">Chính sách đổi trả hàng</a></li>
                <li><a href="#">Quyền lợi khách hàng</a></li>
              </ul>
            </div>
  
            <div className="footer-section">
              <h3>LIÊN HỆ</h3>
              <ul>
                <li>CỬA HÀNG GIANG THUY MOBILE</li>
                <li>Hotline: 0128 922 0142</li>
                <li>Email: giangthuy.mobile@gmail.com</li>
                <li>Địa chỉ: 47 QL1A, TT. Vôi, Lạng Giang, Bắc Giang, Việt Nam</li>
              </ul>
            </div>
          </div>
        </div>
  
        <div className="footer-bottom">
          <div className="container">
            <p>© All rights reserved. Host by Giang Thuy Mobile</p>
          </div>
        </div>
      </footer>
    )
  }
  
  export default Footer