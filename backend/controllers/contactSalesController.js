const { Sib } = require("../config/sendinblue");

const contactSalesController = async (req, res, next) => {
  const { message, email, full_name } = req.body;

  if (!message || !email || !full_name) {
    return res.status(400).json("Please give all the required values.");
  }

  try {
    const tranEmailApi = new Sib.TransactionalEmailsApi();
    const sender = {
      email: "tareef.ramez.roustom@gmail.com",
      name: "Twin Sales",
    };

    const receivers = [
      {
        email: "uptareef@gmail.com",
      },
    ];

    await tranEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject: "Sales Contact!",
      textContent: `Email: ${email} Hi, I am ${full_name}. ${message}`,
    });
    res.json({ status: "ok" });
  } catch (err) {
    next(new Error(err));
  }
};

module.exports = { contactSalesController };
