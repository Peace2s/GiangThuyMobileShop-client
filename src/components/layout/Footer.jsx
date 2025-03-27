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
                <li>CÔNG TY CỔ PHẦN XYZ</li>
                <li>Hotline: 0128 922 0142</li>
                <li>Email: contact@xyz.com</li>
                <li>Địa chỉ: 123 ABC, Quận X, TP.Y</li>
              </ul>
            </div>
          </div>
  
          <div className="footer-payment">
            <h3>HỖ TRỢ THANH TOÁN</h3>
            <div className="payment-methods">
              <img src="/images/payment/visa.png" alt="Visa" />
              <img src="/images/payment/mastercard.png" alt="Mastercard" />
              <img src="/images/payment/jcb.png" alt="JCB" />
              <img src="/images/payment/agribank.png" alt="Agribank" />
              <img src="/images/payment/vietcombank.png" alt="Vietcombank" />
              <img src="/images/payment/techcombank.png" alt="Techcombank" />
            </div>
          </div>
  
          <div className="footer-shipping">
            <h3>DỊCH VỤ GIAO HÀNG</h3>
            <div className="shipping-methods">
              <img src="/images/shipping/shipping.png" alt="Shipping Service" />
            </div>
          </div>
        </div>
  
        <div className="footer-bottom">
          <div className="container">
            <p>© All rights reserved. Host by XYZ Media</p>
          </div>
        </div>
      </footer>
    )
  }
  
  export default Footer