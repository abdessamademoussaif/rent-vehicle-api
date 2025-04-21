const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Password</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f9;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
    }
    .reset-container {
      background-color: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }
    .reset-container h2 {
      margin-bottom: 20px;
      text-align: center;
    }
    .form-group {
      margin-bottom: 15px;
    }
    .form-group label {
      display: block;
      font-weight: bold;
    }
    .form-group input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }
    .form-group button {
      width: 100%;
      padding: 10px;
      background-color: #4CAF50;
      border: none;
      color: white;
      font-size: 16px;
      cursor: pointer;
      border-radius: 4px;
      margin-top: 10px;
    }
    .form-group button:hover {
      background-color: #45a049;
    }
    .form-footer {
      text-align: center;
      margin-top: 15px;
    }
  </style>
</head>
<body>

  <div class="reset-container">
    <h2>Reset Your Password</h2>
    <form action="http://your-website.com/reset-password/${resetToken}" method="POST">
      <div class="form-group">
        <label for="email">Enter your email address</label>
        <input type="email" id="email" name="email" required placeholder="Your email address" disabled value="${options.email}">
      </div>

      <div class="form-group">
        <label for="password">New Password</label>
        <input type="password" id="password" name="password" required placeholder="New password">
      </div>

      <div class="form-group">
        <label for="confirm-password">Confirm New Password</label>
        <input type="password" id="confirm-password" name="confirm-password" required placeholder="Confirm new password">
      </div>

      <div class="form-group">
        <button type="submit">Reset Password</button>
      </div>
    </form>

    <div class="form-footer">
      <p>Remembered your password? <a href="http://your-website.com/login">Login here</a></p>
    </div>
  </div>

</body>
</html>
`;
export default htmlContent;