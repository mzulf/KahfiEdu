module.exports = {
  createSuccessResponse: (message, data) => ({
    success: true,
    message,
    ...data
  }),

  AppError: class AppError {
    constructor(message, status) {
      this.message = message;
      this.status = status;
    }
  },

  handleError: (err, res) => {
    return res.status(err.status || 500).json({
      success: false,
      message: err.message
    });
  }
};
