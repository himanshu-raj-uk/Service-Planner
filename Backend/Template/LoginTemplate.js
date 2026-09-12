const loginSuccess = ({
  title = "All Services Planner",
  userName = "Customer",
  loginTime = new Date().toLocaleString(),
  deviceInfo = "Unknown device",
  location = "Unknown location",
  buttonText = "View Account",
  buttonLink = "https://himanshu-raj-uk.github.io/Raj-Trendz/account.html",
  footer = "Thank you for choosing All Services Planner",
}) => {
  return `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">

  <title>${title}</title>

  <style>
    @media only screen and (max-width: 680px) {

      .email-wrapper {
        padding: 20px 10px !important;
      }

      .email-container {
        width: 100% !important;
        max-width: 100% !important;
        border-radius: 12px !important;
      }

      .header {
        padding: 30px 20px !important;
      }

      .header-title {
        font-size: 27px !important;
        line-height: 34px !important;
        letter-spacing: 1px !important;
      }

      .header-subtitle {
        font-size: 13px !important;
        line-height: 22px !important;
      }

      .content {
        padding: 30px 20px !important;
      }

      .success-icon {
        width: 60px !important;
        height: 60px !important;
        line-height: 60px !important;
        font-size: 29px !important;
      }

      .content-heading {
        font-size: 23px !important;
        line-height: 30px !important;
      }

      .message {
        font-size: 15px !important;
        line-height: 26px !important;
      }

      .details-table {
        margin-top: 25px !important;
      }

      .details-label {
        width: 38% !important;
        padding: 12px 10px !important;
        font-size: 13px !important;
        line-height: 20px !important;
      }

      .details-value {
        width: 62% !important;
        padding: 12px 10px !important;
        font-size: 13px !important;
        line-height: 20px !important;
        word-break: break-word !important;
      }

      .button-wrapper {
        padding-top: 28px !important;
      }

      .main-button {
        display: block !important;
        width: 100% !important;
        box-sizing: border-box !important;
        padding: 14px 20px !important;
        font-size: 14px !important;
      }

      .services {
        padding: 25px 20px !important;
      }

      .service-column {
        display: block !important;
        width: 100% !important;
        padding: 8px 0 !important;
      }

      .service-icon {
        font-size: 25px !important;
      }

      .service-name {
        font-size: 13px !important;
        line-height: 20px !important;
      }

      .footer {
        padding: 28px 20px !important;
      }

      .footer-title {
        font-size: 21px !important;
        line-height: 28px !important;
      }

      .footer-message {
        font-size: 14px !important;
        line-height: 23px !important;
      }

      .footer-links {
        line-height: 30px !important;
      }

      .footer-link {
        display: inline-block !important;
        margin: 0 5px !important;
        font-size: 12px !important;
      }

      .separator {
        display: none !important;
      }

      .copyright {
        font-size: 11px !important;
        line-height: 18px !important;
      }
    }

    @media only screen and (max-width: 420px) {

      .email-wrapper {
        padding: 10px 6px !important;
      }

      .header {
        padding: 25px 15px !important;
      }

      .header-title {
        font-size: 23px !important;
        line-height: 30px !important;
      }

      .header-subtitle {
        font-size: 12px !important;
        line-height: 20px !important;
      }

      .content {
        padding: 25px 15px !important;
      }

      .content-heading {
        font-size: 21px !important;
        line-height: 28px !important;
      }

      .message {
        font-size: 14px !important;
        line-height: 24px !important;
      }

      .details-label,
      .details-value {
        padding: 11px 8px !important;
        font-size: 12px !important;
        line-height: 18px !important;
      }

      .services {
        padding: 20px 15px !important;
      }

      .footer {
        padding: 24px 15px !important;
      }

      .footer-title {
        font-size: 20px !important;
      }

      .footer-message {
        font-size: 13px !important;
      }
    }
  </style>
</head>

<body
  style="
    margin:0;
    padding:0;
    background:#eef4ff;
    font-family:Arial,Helvetica,sans-serif;
    -webkit-text-size-adjust:100%;
    -ms-text-size-adjust:100%;
  "
>

<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
  role="presentation"
  class="email-wrapper"
  style="
    width:100%;
    background:#eef4ff;
    padding:35px 15px;
  "
>
  <tr>
    <td align="center">

      <table
        width="650"
        cellpadding="0"
        cellspacing="0"
        border="0"
        role="presentation"
        class="email-container"
        style="
          width:100%;
          max-width:650px;
          background:#ffffff;
          border-radius:16px;
          overflow:hidden;
        "
      >

        <tr>
          <td
            style="
              height:6px;
              background:#2563eb;
              font-size:0;
              line-height:0;
            "
          ></td>
        </tr>

        <tr>
          <td
            align="center"
            class="header"
            style="
              padding:40px 25px;
              background:#2563eb;
            "
          >
            <h1
              class="header-title"
              style="
                margin:0;
                color:#ffffff;
                font-size:32px;
                line-height:40px;
                font-weight:800;
                letter-spacing:1.5px;
              "
            >
              ALL SERVICES PLANNER
            </h1>

            <p
              class="header-subtitle"
              style="
                margin:10px 0 0;
                color:#dbeafe;
                font-size:14px;
                line-height:22px;
              "
            >
              Tour • Events • Birthday
            </p>
          </td>
        </tr>

        <tr>
          <td
            align="center"
            class="content"
            style="
              padding:40px 35px;
              background:#ffffff;
            "
          >

            <table
              width="70"
              height="70"
              cellpadding="0"
              cellspacing="0"
              border="0"
              role="presentation"
              style="
                width:70px;
                height:70px;
                background:#dbeafe;
                border-radius:50%;
              "
            >
              <tr>
                <td
                  align="center"
                  valign="middle"
                  class="success-icon"
                  style="
                    width:70px;
                    height:70px;
                    color:#2563eb;
                    font-size:34px;
                    line-height:70px;
                    font-weight:bold;
                  "
                >
                  ✓
                </td>
              </tr>
            </table>

            <h2
              class="content-heading"
              style="
                margin:22px 0 0;
                color:#1e3a8a;
                font-size:26px;
                line-height:34px;
                font-weight:700;
              "
            >
              Login Successful
            </h2>

            <p
              class="message"
              style="
                margin:22px 0 0;
                color:#555555;
                font-size:16px;
                line-height:28px;
                text-align:left;
              "
            >
              Hello <b>${userName}</b>,
              <br><br>

              A successful login was detected on your
              <b>All Services Planner</b> account.

              <br><br>

              If this was you, you can safely ignore this email.

              <br><br>

              If you don't recognize this activity, please change
              your password immediately.
            </p>

            <table
              width="100%"
              cellpadding="0"
              cellspacing="0"
              border="0"
              role="presentation"
              class="details-table"
              style="
                width:100%;
                margin-top:28px;
                border-collapse:collapse;
                border:1px solid #dbeafe;
              "
            >

              <tr>
                <td
                  width="35%"
                  class="details-label"
                  style="
                    width:35%;
                    padding:14px 12px;
                    background:#eff6ff;
                    border-bottom:1px solid #dbeafe;
                    color:#1e3a8a;
                    font-size:14px;
                    line-height:20px;
                    font-weight:bold;
                    text-align:left;
                  "
                >
                  Login Time
                </td>

                <td
                  width="65%"
                  class="details-value"
                  style="
                    width:65%;
                    padding:14px 12px;
                    border-bottom:1px solid #dbeafe;
                    color:#475569;
                    font-size:14px;
                    line-height:20px;
                    text-align:left;
                    word-break:break-word;
                  "
                >
                  ${loginTime}
                </td>
              </tr>

              <tr>
                <td
                  width="35%"
                  class="details-label"
                  style="
                    width:35%;
                    padding:14px 12px;
                    background:#eff6ff;
                    border-bottom:1px solid #dbeafe;
                    color:#1e3a8a;
                    font-size:14px;
                    line-height:20px;
                    font-weight:bold;
                    text-align:left;
                  "
                >
                  Device
                </td>

                <td
                  width="65%"
                  class="details-value"
                  style="
                    width:65%;
                    padding:14px 12px;
                    border-bottom:1px solid #dbeafe;
                    color:#475569;
                    font-size:14px;
                    line-height:20px;
                    text-align:left;
                    word-break:break-word;
                  "
                >
                  ${deviceInfo}
                </td>
              </tr>

              <tr>
                <td
                  width="35%"
                  class="details-label"
                  style="
                    width:35%;
                    padding:14px 12px;
                    background:#eff6ff;
                    color:#1e3a8a;
                    font-size:14px;
                    line-height:20px;
                    font-weight:bold;
                    text-align:left;
                  "
                >
                  Location
                </td>

                <td
                  width="65%"
                  class="details-value"
                  style="
                    width:65%;
                    padding:14px 12px;
                    color:#475569;
                    font-size:14px;
                    line-height:20px;
                    text-align:left;
                    word-break:break-word;
                  "
                >
                  ${location}
                </td>
              </tr>

            </table>

            <table
              width="100%"
              cellpadding="0"
              cellspacing="0"
              border="0"
              role="presentation"
            >
              <tr>
                <td
                  align="center"
                  class="button-wrapper"
                  style="
                    padding-top:32px;
                  "
                >
                  <a
                    href="${buttonLink}"
                    class="main-button"
                    style="
                      display:inline-block;
                      padding:15px 40px;
                      background:#2563eb;
                      color:#ffffff;
                      text-decoration:none;
                      border-radius:8px;
                      font-size:15px;
                      line-height:20px;
                      font-weight:bold;
                    "
                  >
                    ${buttonText}
                  </a>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <tr>
          <td
            class="services"
            style="
              padding:25px 20px;
              background:#f8fafc;
            "
          >

            <table
              width="100%"
              cellpadding="0"
              cellspacing="0"
              border="0"
              role="presentation"
            >
              <tr>

                <td
                  width="33.33%"
                  align="center"
                  valign="top"
                  class="service-column"
                  style="
                    padding:8px;
                  "
                >
                  <div
                    class="service-icon"
                    style="
                      font-size:27px;
                      line-height:32px;
                    "
                  >
                    ✈️
                  </div>

                  <div
                    class="service-name"
                    style="
                      margin-top:5px;
                      color:#334155;
                      font-size:12px;
                      line-height:18px;
                    "
                  >
                    Tour
                  </div>
                </td>

                <td
                  width="33.33%"
                  align="center"
                  valign="top"
                  class="service-column"
                  style="
                    padding:8px;
                  "
                >
                  <div
                    class="service-icon"
                    style="
                      font-size:27px;
                      line-height:32px;
                    "
                  >
                    🎉
                  </div>

                  <div
                    class="service-name"
                    style="
                      margin-top:5px;
                      color:#334155;
                      font-size:12px;
                      line-height:18px;
                    "
                  >
                    Events
                  </div>
                </td>

                <td
                  width="33.33%"
                  align="center"
                  valign="top"
                  class="service-column"
                  style="
                    padding:8px;
                  "
                >
                  <div
                    class="service-icon"
                    style="
                      font-size:27px;
                      line-height:32px;
                    "
                  >
                    🎂
                  </div>

                  <div
                    class="service-name"
                    style="
                      margin-top:5px;
                      color:#334155;
                      font-size:12px;
                      line-height:18px;
                    "
                  >
                    Birthday
                  </div>
                </td>

              </tr>
            </table>

          </td>
        </tr>

        <tr>
          <td
            align="center"
            class="footer"
            style="
              padding:30px 25px;
              background:#1e3a8a;
            "
          >

            <h2
              class="footer-title"
              style="
                margin:0;
                color:#ffffff;
                font-size:22px;
                line-height:30px;
                font-weight:700;
              "
            >
              ALL SERVICES PLANNER
            </h2>

            <p
              class="footer-message"
              style="
                margin:12px 0 0;
                color:#dbeafe;
                font-size:14px;
                line-height:24px;
              "
            >
              ${footer}
            </p>

            <p
              class="footer-message"
              style="
                margin:16px 0 0;
                color:#bfdbfe;
                font-size:12px;
                line-height:20px;
              "
            >
              This is an automated security email.
              Please do not reply.
            </p>

            <table
              cellpadding="0"
              cellspacing="0"
              border="0"
              role="presentation"
              align="center"
              style="
                margin-top:16px;
              "
            >
              <tr>
                <td
                  align="center"
                  class="footer-links"
                  style="
                    line-height:28px;
                  "
                >

                  <a
                    href="http://localhost:5173"
                    class="footer-link"
                    style="
                      color:#ffffff;
                      text-decoration:none;
                      font-size:13px;
                      margin:0 8px;
                    "
                  >
                    Home
                  </a>

                  <span
                    class="separator"
                    style="color:#93c5fd;"
                  >
                    |
                  </span>

                  <a
                    href="http://localhost:5173/services"
                    class="footer-link"
                    style="
                      color:#ffffff;
                      text-decoration:none;
                      font-size:13px;
                      margin:0 8px;
                    "
                  >
                    Services
                  </a>

                  <span
                    class="separator"
                    style="color:#93c5fd;"
                  >
                    |
                  </span>

                  <a
                    href="http://localhost:5173/planner"
                    class="footer-link"
                    style="
                      color:#ffffff;
                      text-decoration:none;
                      font-size:13px;
                      margin:0 8px;
                    "
                  >
                    Planner
                  </a>

                  <span
                    class="separator"
                    style="color:#93c5fd;"
                  >
                    |
                  </span>

                  <a
                    href="http://localhost:5173/contact"
                    class="footer-link"
                    style="
                      color:#ffffff;
                      text-decoration:none;
                      font-size:13px;
                      margin:0 8px;
                    "
                  >
                    Contact
                  </a>

                </td>
              </tr>
            </table>

            <p
              class="copyright"
              style="
                margin:16px 0 0;
                color:#93c5fd;
                font-size:12px;
                line-height:20px;
              "
            >
              © ${new Date().getFullYear()} All Services Planner.
              All Rights Reserved.
            </p>

          </td>
        </tr>

      </table>

    </td>
  </tr>

</table>

</body>
</html>
`;
};

module.exports = loginSuccess;
