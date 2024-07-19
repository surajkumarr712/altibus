
// This function handles user login
export const login = (req, res) => {
  // SQL query to check if the user exists in the DB
  const query = "SELECT * FROM users WHERE username = ?";

  // Execute the query with the provided username
  db.query(query, [req.body.username], (err, data) => {
    // Handle DB errors
    if (err) return res.json(err);

    // If no user is found, return an error
    if (data.length === 0) return res.status(404).json("User not found!");

    // Check if the password is correct
    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );

    // If the password is incorrect, return an error
    if (!isPasswordCorrect)
      return res.status(400).json("Wrong username or password!");

    // If the login is successful, create a JSON web token
    const token = jwt.sign({ id: data[0].id }, "jwtkey");

    // Remove the password from the user data
    const { password, ...other } = data[0];

    // Set the token as a http-only cookie and send user data as response
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(other);
  });
};

// This function handles user logout
export const logout = (req, res) => {
  // Clear the access_token cookie and send a success message
  res
    .clearCookie("access_token", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .json("User has been logged out.");
};