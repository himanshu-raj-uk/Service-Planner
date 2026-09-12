const emailTemplate = ({
  title = "All Services Planner",
  heading,
  message,
  buttonText = "Explore Now",
  buttonLink = "https://himanshu-raj-uk.github.io/Raj-Trendz/home.html",
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

      .email-body {
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
      }

      .header-subtitle {
        font-size: 14px !important;
        line-height: 22px !important;
      }

      .content {
        padding: 30px 20px !important;
      }

      .heading {
        font-size: 23px !important;
        line-height: 31px !important;
      }

      .message {
        font-size: 15px !important;
        line-height: 26px !important;
      }

      .button-wrapper {
        padding: 25px 0 !important;
      }

      .button {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        padding: 15px 20px !important;
      }

      .feature {
        display: block !important;
        width: 100% !important;
        padding: 12px 0 !important;
      }

      .feature-icon {
        font-size: 32px !important;
        line-height: 36px !important;
      }

      .feature-title {
        font-size: 14px !important;
        line-height: 20px !important;
      }

      .footer {
        padding: 25px 20px !important;
      }

      .footer-title {
        font-size: 21px !important;
        line-height: 28px !important;
      }

      .footer-text {
        font-size: 13px !important;
        line-height: 22px !important;
      }

      .footer-links {
        line-height: 30px !important;
      }

      .footer-link {
        display: inline-block !important;
        margin: 0 6px !important;
      }
    }

    @media only screen and (max-width: 420px) {

      .email-body {
        padding: 10px 6px !important;
      }

      .header {
        padding: 25px 15px !important;
      }

      .header-title {
        font-size: 24px !important;
        line-height: 31px !important;
      }

      .header-subtitle {
        font-size: 13px !important;
        line-height: 20px !important;
        letter-spacing: 0.5px !important;
      }

      .content {
        padding: 25px 15px !important;
      }

      .heading {
        font-size: 21px !important;
        line-height: 29px !important;
      }

      .message {
        font-size: 14px !important;
        line-height: 24px !important;
      }

      .button-wrapper {
        padding: 20px 0 !important;
      }

      .button {
        padding: 14px 18px !important;
        font-size: 14px !important;
      }

      .feature {
        padding: 10px 0 !important;
      }

      .footer {
        padding: 22px 15px !important;
      }

      .footer-link {
        margin: 0 5px !important;
      }
    }
  </style>
</head>

<body
  style="
    margin:0;
    padding:0;
    background:#f4f7fb;
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
    class="email-body"
    style="
      width:100%;
      background:#f4f7fb;
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

          <!-- Header -->

          <tr>
            <td
              align="center"
              class="header"
              style="
                padding:40px 30px;
                background:#2563eb;
                background:linear-gradient(
                  135deg,
                  #2563eb,
                  #06b6d4
                );
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
                "
              >
                All Services
              </h1>

              <p
                class="header-subtitle"
                style="
                  margin:8px 0 0;
                  color:#dbeafe;
                  font-size:15px;
                  line-height:24px;
                  letter-spacing:0.8px;
                "
              >
                Your Complete Event & Travel Planning Partner
              </p>

            </td>
          </tr>

          <!-- Main Content -->

          <tr>
            <td
              class="content"
              style="
                padding:40px 35px;
              "
            >

              <h2
                class="heading"
                style="
                  margin:0;
                  color:#1e293b;
                  font-size:26px;
                  line-height:34px;
                  font-weight:700;
                "
              >
                ${heading}
              </h2>

              <p
                class="message"
                style="
                  margin:20px 0 0;
                  color:#475569;
                  font-size:16px;
                  line-height:28px;
                "
              >
                ${message}
              </p>

              <!-- Button -->

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
                      padding:30px 0;
                    "
                  >

                    <a
                      href="${buttonLink}"
                      class="button"
                      style="
                        display:inline-block;
                        padding:15px 38px;
                        background:#2563eb;
                        color:#ffffff;
                        text-decoration:none;
                        border-radius:8px;
                        font-size:15px;
                        line-height:20px;
                        font-weight:700;
                      "
                    >
                      ${buttonText}
                    </a>

                  </td>
                </tr>

              </table>

              <!-- Features -->

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
                    class="feature"
                    style="
                      padding:15px 10px;
                    "
                  >

                    <div
                      class="feature-icon"
                      style="
                        font-size:34px;
                        line-height:40px;
                      "
                    >
                      ✈️
                    </div>

                    <p
                      class="feature-title"
                      style="
                        margin:8px 0 0;
                        color:#334155;
                        font-size:14px;
                        line-height:20px;
                        font-weight:700;
                      "
                    >
                      Travel Planning
                    </p>

                  </td>

                  <td
                    width="33.33%"
                    align="center"
                    valign="top"
                    class="feature"
                    style="
                      padding:15px 10px;
                    "
                  >

                    <div
                      class="feature-icon"
                      style="
                        font-size:34px;
                        line-height:40px;
                      "
                    >
                      🎉
                    </div>

                    <p
                      class="feature-title"
                      style="
                        margin:8px 0 0;
                        color:#334155;
                        font-size:14px;
                        line-height:20px;
                        font-weight:700;
                      "
                    >
                      Event Planning
                    </p>

                  </td>

                  <td
                    width="33.33%"
                    align="center"
                    valign="top"
                    class="feature"
                    style="
                      padding:15px 10px;
                    "
                  >

                    <div
                      class="feature-icon"
                      style="
                        font-size:34px;
                        line-height:40px;
                      "
                    >
                      🏨
                    </div>

                    <p
                      class="feature-title"
                      style="
                        margin:8px 0 0;
                        color:#334155;
                        font-size:14px;
                        line-height:20px;
                        font-weight:700;
                      "
                    >
                      Hotel Booking
                    </p>

                  </td>

                </tr>

              </table>

            </td>
          </tr>

          <!-- Footer -->

          <tr>
            <td
              align="center"
              class="footer"
              style="
                padding:30px 25px;
                background:#f8fafc;
              "
            >

              <h3
                class="footer-title"
                style="
                  margin:0;
                  color:#2563eb;
                  font-size:22px;
                  line-height:30px;
                  font-weight:700;
                "
              >
                All Services Planner
              </h3>

              <p
                class="footer-text"
                style="
                  margin:10px 0 0;
                  color:#64748b;
                  font-size:14px;
                  line-height:24px;
                "
              >
                ${footer}
              </p>

              <p
                class="footer-text"
                style="
                  margin:18px 0 0;
                  color:#94a3b8;
                  font-size:12px;
                  line-height:20px;
                "
              >
                © ${new Date().getFullYear()} All Services Planner.
                All Rights Reserved.
              </p>

              <p
                class="footer-text"
                style="
                  margin:8px 0 0;
                  color:#94a3b8;
                  font-size:12px;
                  line-height:20px;
                "
              >
                This is an automated email. Please do not reply.
              </p>

              <!-- Footer Links -->

              <table
                cellpadding="0"
                cellspacing="0"
                border="0"
                role="presentation"
                align="center"
                style="
                  margin-top:15px;
                "
              >

                <tr>

                  <td class="footer-links">

                    <a
                      href="${buttonLink}"
                      class="footer-link"
                      style="
                        color:#2563eb;
                        text-decoration:none;
                        font-size:13px;
                        margin:0 10px;
                      "
                    >
                      Home
                    </a>

                    <a
                      href="${buttonLink}/services"
                      class="footer-link"
                      style="
                        color:#2563eb;
                        text-decoration:none;
                        font-size:13px;
                        margin:0 10px;
                      "
                    >
                      Services
                    </a>

                    <a
                      href="${buttonLink}/contact"
                      class="footer-link"
                      style="
                        color:#2563eb;
                        text-decoration:none;
                        font-size:13px;
                        margin:0 10px;
                      "
                    >
                      Contact
                    </a>

                  </td>

                </tr>

              </table>

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

module.exports = emailTemplate;
